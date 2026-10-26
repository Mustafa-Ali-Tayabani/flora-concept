<?php
/**
 * Flora Concept · quote request endpoint (POST /api/devis.php, JSON).
 *
 * - Same-origin only (Origin / Sec-Fetch-Site), JSON body ≤ 16 KB
 * - Honeypot field `website` + minimum fill time: bots get a fake success
 * - Server-side validation mirroring the form (name, email or phone, need)
 * - Rate limit per IP (hashed, file based): 5 requests / 10 minutes
 * - Sends the request to the agency of the selected zone, plus an
 *   acknowledgement to the requester when an email address was given
 *
 * Configuration lives OUTSIDE the web root: see server/devis.config.example.php.
 */

declare(strict_types=1);

date_default_timezone_set('Europe/Paris');

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function respond(int $status, array $body): never
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

$configFile = getenv('FLORA_DEVIS_CONFIG') ?: dirname(__DIR__, 2) . '/devis.config.php';
if (!is_file($configFile)) {
    error_log('devis.php: missing configuration file ' . $configFile);
    respond(500, ['ok' => false]);
}
/** @var array{allowed_origins: string[], recipients: array<string,string>, default_recipient: string, from: string, from_name: string, storage_dir: string, rate_limit: int, rate_window: int, min_fill_ms: int, ip_salt: string} $config */
$config = require $configFile;

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false]);
}

// --- Same-origin check (CSRF) ---------------------------------------------
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$fetchSite = $_SERVER['HTTP_SEC_FETCH_SITE'] ?? '';
if (($origin !== '' && !in_array($origin, $config['allowed_origins'], true)) || ($fetchSite !== '' && $fetchSite !== 'same-origin')) {
    respond(403, ['ok' => false]);
}
if (stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== 0) {
    respond(415, ['ok' => false]);
}

$raw = file_get_contents('php://input', false, null, 0, 16384 + 1);
if ($raw === false || strlen($raw) > 16384) {
    respond(413, ['ok' => false]);
}
$in = json_decode($raw, true);
if (!is_array($in)) {
    respond(400, ['ok' => false]);
}

$str = static function (string $key, int $max) use ($in): string {
    $v = $in[$key] ?? '';
    if (!is_string($v)) {
        return '';
    }
    // Strip control characters (incl. CR/LF for single-line fields).
    $v = preg_replace('/[^\P{C}\n\t]/u', '', $v) ?? '';
    return mb_substr(trim($v), 0, $max);
};

$nom = preg_replace('/\s+/u', ' ', $str('nom', 120)) ?? '';
$contact = preg_replace('/\s+/u', ' ', $str('contact', 160)) ?? '';
$besoin = $str('besoin', 3000);
$zone = in_array($in['zone'] ?? '', ['paris', 'nice', 'marseille'], true) ? $in['zone'] : '';
$source = preg_match('#^/[a-z0-9\-/]*$#', (string) ($in['source'] ?? '')) ? (string) $in['source'] : '';
$elapsed = is_numeric($in['elapsed'] ?? null) ? (int) $in['elapsed'] : 0;
$lang = ($in['lang'] ?? '') === 'en' ? 'English' : 'Français';

// --- Bots: honeypot filled or form submitted inhumanly fast -----------------
if ($str('website', 200) !== '' || $elapsed < $config['min_fill_ms']) {
    respond(200, ['ok' => true]);
}

// --- Validation -------------------------------------------------------------
$isEmail = (bool) filter_var($contact, FILTER_VALIDATE_EMAIL);
$isPhone = strlen(preg_replace('/\D/', '', $contact) ?? '') >= 10;
$errors = [];
if ($nom === '') {
    $errors['nom'] = true;
}
if (!$isEmail && !$isPhone) {
    $errors['contact'] = true;
}
if ($besoin === '') {
    $errors['besoin'] = true;
}
if ($errors) {
    respond(422, ['ok' => false, 'errors' => $errors]);
}

// --- Rate limiting ------------------------------------------------------------
$dir = rtrim($config['storage_dir'], '/');
if (!is_dir($dir) && !mkdir($dir, 0700, true) && !is_dir($dir)) {
    error_log('devis.php: cannot create storage dir');
    respond(500, ['ok' => false]);
}
$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$bucket = $dir . '/rl-' . hash_hmac('sha256', $ip, $config['ip_salt']) . '.json';
$now = time();
$fh = fopen($bucket, 'c+');
if ($fh === false) {
    respond(500, ['ok' => false]);
}
flock($fh, LOCK_EX);
$hits = json_decode(stream_get_contents($fh) ?: '[]', true);
$hits = array_values(array_filter(is_array($hits) ? $hits : [], static fn ($t) => is_int($t) && $t > $now - $config['rate_window']));
if (count($hits) >= $config['rate_limit']) {
    flock($fh, LOCK_UN);
    fclose($fh);
    header('Retry-After: ' . $config['rate_window']);
    respond(429, ['ok' => false]);
}
$hits[] = $now;
ftruncate($fh, 0);
rewind($fh);
fwrite($fh, json_encode($hits));
flock($fh, LOCK_UN);
fclose($fh);

// --- Mail -------------------------------------------------------------------
$zoneLabels = ['marseille' => 'Marseille et Provence', 'nice' => "Nice et Côte d'Azur", 'paris' => 'Paris et Île-de-France'];
$zoneLabel = $zoneLabels[$zone] ?? 'Non précisée';
$to = $config['recipients'][$zone] ?? $config['default_recipient'];

$encodeHeader = static fn (string $v): string => '=?UTF-8?B?' . base64_encode($v) . '?=';
$headers = static function (?string $replyTo) use ($config, $encodeHeader): string {
    $h = [
        'From: ' . $encodeHeader($config['from_name']) . ' <' . $config['from'] . '>',
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        'X-Mailer: flora-devis',
    ];
    if ($replyTo !== null) {
        $h[] = 'Reply-To: ' . $replyTo;
    }
    return implode("\r\n", $h);
};

$body = "Nouvelle demande de devis\n\n"
    . "Nom : {$nom}\n"
    . "Contact : {$contact}\n"
    . "Équipe : {$zoneLabel}\n"
    . 'Page d’origine : ' . ($source ?: '—') . "\n"
    . "Langue du visiteur : {$lang}\n"
    . 'Date : ' . date('d/m/Y H:i') . "\n\n"
    . "Besoin :\n{$besoin}\n";

$sent = mail($to, $encodeHeader("Demande de devis : {$nom}"), $body, $headers($isEmail ? $contact : null), '-f' . $config['from']);
if (!$sent) {
    error_log('devis.php: mail() failed');
    respond(500, ['ok' => false]);
}

if ($isEmail) {
    // Acknowledgement copy is configured by the client (see devis.config.php).
    $ack = $config['ack_body'] ?? null;
    if (is_string($ack) && $ack !== '') {
        mail($contact, $encodeHeader($config['ack_subject'] ?? 'Flora Concept'), str_replace('{nom}', $nom, $ack), $headers(null), '-f' . $config['from']);
    }
}

respond(200, ['ok' => true]);
