import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * "?" diminuto con burbuja al pasar el mouse o al enfocar con Tab.
 * Sustituye a los bloques de alerta/nota que ocupaban media pantalla.
 *
 *   <mt-help>Texto de ayuda con <b>HTML</b> permitido.</mt-help>
 *   <mt-help align="start">…</mt-help>   <- dentro de un modal
 *
 * `align="start"` ancla la burbuja a la izquierda: dentro de un contenedor con
 * overflow:hidden una burbuja centrada se recortaría contra el borde.
 */
@Component({
  selector: 'mt-help',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="mt-help" tabindex="0" role="button" [attr.aria-label]="ariaLabel">?
      <span class="mt-help-bubble" [class.start]="align === 'start'">
        <ng-content></ng-content>
      </span>
    </span>
  `,
  styles: [`
    :host { display: inline-flex; vertical-align: middle; }
  `],
})
export class HelpTooltipComponent {
  @Input() align: 'center' | 'start' = 'center';
  @Input() ariaLabel = 'Ver detalle';
}
