import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import '@salsafx/ui';

const isNil = (value: unknown): value is null | undefined =>
    typeof value === 'undefined' || value === null;

function createWorker(workerFunction: () => void): Worker {
    const source = `(${workerFunction.toString()})();`;
    const blob = new Blob([source], { type: 'application/javascript' });
    return new Worker(URL.createObjectURL(blob));
}

@customElement('live-clock')
export class LiveClock extends LitElement {
    static styles = css`
        :host {
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
        }
    `;

    @property({ type: Number }) size = 250;
    @property({ type: Boolean, attribute: 'has-scale-labels' }) hasScaleLabels = true;
    @property({ type: Boolean, attribute: 'has-shell' }) hasShell = true;

    @state() private now = new Date();
    private worker?: Worker;

    connectedCallback() {
        super.connectedCallback();

        this.worker = createWorker(() => {
            setInterval(() => {
                postMessage(Date.now());
            }, 1000);
        });

        this.worker.onmessage = (e) => {
            this.now = new Date(e.data);
        };
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (!isNil(this.worker)) {
            this.worker.terminate();
        }
    }

    render() {
        const hours = this.now.getHours() % 12;
        const minutes = this.now.getMinutes();
        const seconds = this.now.getSeconds();
        const hourValue = hours + minutes / 60;
        const minuteValue = minutes + seconds / 60;

        return html`
            <fx-radial-gauge
                .min="${0}"
                .max="${12}"
                start-angle="0"
                arc-length="360"
                .hasValueDisplay="${false}"
                .hasTrack="${false}"
                .hasShell="${this.hasShell}"
                style="--fx-gauge-size: ${this.size}px;"
            >
                <fx-radial-scale
                    slot="scale"
                    count="12"
                    start-angle="0"
                    arc-length="360"
                    sub-divisions="5"
                    min="0"
                    max="12"
                    .hasScaleLabels="${this.hasScaleLabels}"
                    .replacements="${{ 0: 12 }}"
                ></fx-radial-scale>

                <fx-gauge-needle
                    slot="needle"
                    start-angle="0"
                    arc-length="360"
                    .value="${seconds}"
                    .min="${0}"
                    .max="${60}"
                    style="--fx-gauge-needle-gradient-start: #06b6d4; --fx-gauge-needle-gradient-end: #8eeeff;"
                ></fx-gauge-needle>

                <fx-gauge-needle-triangle
                    slot="needle"
                    start-angle="0"
                    arc-length="360"
                    .value="${minuteValue}"
                    .min="${0}"
                    .max="${60}"
                    style="--fx-gauge-needle-gradient-start: #94a3b8; --fx-gauge-needle-gradient-end: #cbd5e1;"
                ></fx-gauge-needle-triangle>

                <fx-gauge-needle-triangle
                    slot="needle"
                    start-angle="0"
                    arc-length="360"
                    .value="${hourValue}"
                    .min="${0}"
                    .max="${12}"
                    thickness="4.5"
                    style="transform: scale(0.65);"
                ></fx-gauge-needle-triangle>
            </fx-radial-gauge>
        `;
    }
}
