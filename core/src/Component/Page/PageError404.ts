import { LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { html } from 'lit/static-html.js';

@customElement('ember-nexus-app-core-page-error-404')
class PageError404 extends LitElement {
  render(): TemplateResult {
    return html`<div>Error 404: Route could not be resolved.</div>`;
  }
}

export { PageError404 };
