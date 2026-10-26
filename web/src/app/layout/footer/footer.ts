import { NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteStore } from '../../core/site/site.store';
import { BranchArt } from '../../shared/icons';

/**
 * G6 · footer: entity sentence (identical everywhere), link columns, Gémenos NAP,
 * covered regions, legal links and « Gestion des cookies ».
 */
@Component({
  selector: 'fc-footer',
  imports: [RouterLink, NgOptimizedImage, NgTemplateOutlet, BranchArt],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  protected readonly s = inject(SiteStore).settings;
  protected readonly t = inject(SiteStore).t;
  protected readonly cols = computed(() => {
    const [services, outdoor, cities, company] = this.s().footer.columns;
    return { services, outdoor, cities, company };
  });
}
