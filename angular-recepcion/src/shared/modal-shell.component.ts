import {
  Component, Input, Output, EventEmitter, HostListener, ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Envoltura de modal sin dependencias (ni Material ni CDK).
 * Proyecta cabecera, cuerpo y pie mediante slots:
 *
 *   <mt-modal [open]="abierto" size="lg" (closed)="abierto = false">
 *     <ng-container head>…</ng-container>
 *     <ng-container body>…</ng-container>
 *     <ng-container foot>…</ng-container>
 *   </mt-modal>
 *
 * Si tu proyecto ya tiene un servicio de diálogos, puedes descartar este
 * componente y montar los cuerpos dentro del tuyo: la lógica no depende de él.
 */
@Component({
  selector: 'mt-modal',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mt-modal-overlay" [class.open]="open" (click)="onOverlay($event)">
      <div class="mt-modal" [ngClass]="[size, extraClass]">
        <div class="mt-modal-head">
          <ng-content select="[head]"></ng-content>
          <button type="button" class="mt-icon-btn mt-modal-close" (click)="close()">
            <span class="material-icons">close</span>
          </button>
        </div>
        <ng-content select="[fixed]"></ng-content>
        <div class="mt-modal-body">
          <ng-content select="[body]"></ng-content>
        </div>
        <ng-content select="[floating]"></ng-content>
        <div class="mt-modal-foot">
          <ng-content select="[foot]"></ng-content>
        </div>
      </div>
    </div>
  `,
})
export class ModalShellComponent {
  @Input() open = false;
  /** '' | 'md' (800px) | 'lg' (760px) */
  @Input() size: '' | 'md' | 'lg' = '';
  @Input() extraClass = '';
  @Output() closed = new EventEmitter<void>();

  close(): void { this.closed.emit(); }

  onOverlay(ev: MouseEvent): void {
    if ((ev.target as HTMLElement).classList.contains('mt-modal-overlay')) this.close();
  }

  @HostListener('document:keydown.escape')
  onEsc(): void { if (this.open) this.close(); }
}
