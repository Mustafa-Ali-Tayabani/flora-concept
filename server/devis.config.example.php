<?php
/**
 * Copy to the hosting account ONE LEVEL ABOVE the web root, e.g.
 *   /home/<user>/domains/floraconcept.fr/devis.config.php   (public_html is the web root)
 * or point the FLORA_DEVIS_CONFIG environment variable to it.
 * Never commit the real file.
 */
return [
    // Origins allowed to post the form (scheme + host, no trailing slash).
    'allowed_origins' => ['https://www.floraconcept.fr'],

    // Recipient per team (client data: « adresse(s) email de réception des devis »).
    'recipients' => [
        'marseille' => 'devis-paca@example.com',
        'nice' => 'devis-paca@example.com',
        'paris' => 'devis-idf@example.com',
    ],
    'default_recipient' => 'devis@example.com',

    // Must be a mailbox of the sending domain (SPF/DKIM aligned).
    'from' => 'no-reply@floraconcept.fr',
    'from_name' => 'Flora Concept',

    // Acknowledgement sent to the requester when they gave an email address.
    // The French copy must be provided by the client; empty = not sent.
    'ack_subject' => '',
    'ack_body' => '',

    // Writable directory outside the web root (rate-limit buckets).
    'storage_dir' => __DIR__ . '/devis-storage',
    'rate_limit' => 5,        // requests…
    'rate_window' => 600,     // …per 10 minutes per IP
    'min_fill_ms' => 2500,    // faster submissions are treated as bots
    'ip_salt' => 'change-me-to-a-long-random-string',
];
