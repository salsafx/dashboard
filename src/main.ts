import '@salsafx/ui';
import { Fx, Fonts, DisplayFonts, IconPacks, Themes, FxToaster } from '@salsafx/ui';

Fx.configure({
    uiFont: Fonts.Inter,
    displayFont: DisplayFonts.Segmented,
    iconPacks: [IconPacks.FontAwesome],
    theme: Themes.DarkGreen,
});

type SwitchHost = HTMLElement & {
    states: Array<{ id: string; label: string; backgroundColor: string }>;
};

type RotaryHost = HTMLElement & {
    sectors: Array<{
        id: string;
        label: string;
        color: string;
        textColor: string;
        ranges: string[];
        startDeg: number;
        endDeg: number;
    }>;
};

const gridSwitch = document.querySelector<SwitchHost>('#grid-mode');
if (gridSwitch) {
    gridSwitch.states = [
        { id: 'off', label: 'OFF', backgroundColor: '#334155' },
        { id: 'island', label: 'ISLE', backgroundColor: '#f59e0b' },
        { id: 'grid', label: 'GRID', backgroundColor: '#84cc16' },
        { id: 'standby', label: 'STBY', backgroundColor: '#14b8a6' },
    ];
}

const rotary = document.querySelector<RotaryHost>('#bus-meter');
if (rotary) {
    rotary.sectors = [
        { id: 'off', label: 'OFF', color: '#1e293b', textColor: '#475569', ranges: ['OFF'], startDeg: 250, endDeg: 290 },
        { id: 'ac', label: 'AC', color: '#082f49', textColor: '#38bdf8', ranges: ['230V', '400V'], startDeg: 290, endDeg: 360 },
        { id: 'dc', label: 'DC', color: '#052e16', textColor: '#86efac', ranges: ['24V', '48V', '110V'], startDeg: 360, endDeg: 440 },
        { id: 'frq', label: 'Hz', color: '#431407', textColor: '#fdba74', ranges: ['50Hz', '60Hz'], startDeg: 440, endDeg: 510 },
    ];
}

function updateClocks() {
    const now = new Date();
    const hh = String(now.getUTCHours()).padStart(2, '0');
    const mm = String(now.getUTCMinutes()).padStart(2, '0');
    const ss = String(now.getUTCSeconds()).padStart(2, '0');
    document.querySelectorAll<HTMLElement>('.js-utc-clock').forEach(el => {
        el.textContent = `${hh}:${mm}:${ss}`;
    });
}
updateClocks();
setInterval(updateClocks, 1000);

document.getElementById('estop-hdr')?.addEventListener('press', () => {
    FxToaster.setup({ duration: 0, placement: 'top-end' }).danger('⚠ E-STOP ACTIVATED — system halted');
});
document.getElementById('ack-btn')?.addEventListener('press', () => {
    FxToaster.success('All alarms acknowledged');
});

function buildChart(id: string, data: number[], color: string, dimColor: string, normalize?: number) {
    const el = document.getElementById(id);
    if (!el) return;
    const max = normalize ?? Math.max(...data);
    data.forEach((v, i) => {
        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        bar.style.setProperty('--bar-h', `${Math.max(2, Math.round((v / max) * 100))}%`);
        bar.style.setProperty('--bar-c', i === data.length - 1 ? color : dimColor);
        el.appendChild(bar);
    });
}

buildChart('chart-power', [1.2, 2.1, 1.8, 3.4, 4.2, 5.1, 4.8, 5.5, 6.2, 5.8, 6.1, 5.9, 5.2, 4.8, 5.5, 6.0, 5.8, 5.4, 4.5, 3.2, 2.8, 2.1, 1.5, 4.5], '#84cc16', '#365314', 7);
buildChart('chart-wind', [8, 9, 7, 10, 12, 14, 13, 15, 17, 16, 18, 17, 16, 15, 16, 17, 18, 18, 17, 16, 15, 14, 16, 18], '#38bdf8', '#0c4a6e', 20);
buildChart('chart-temp', [42, 44, 46, 48, 50, 53, 55, 57, 58, 59, 61, 63, 64, 65, 65, 66, 67, 67, 68, 67, 67, 68, 68, 68], '#fb7185', '#4c1d2f', 80);
buildChart('chart-rpm', [60, 65, 70, 72, 75, 78, 80, 82, 81, 82, 80, 79, 80, 81, 82, 82, 81, 80, 82, 82, 82, 81, 82, 82], '#f59e0b', '#431407');
buildChart('chart-volt', [3, 5, 6, 5, 4, 5, 5, 6, 5, 5, 5, 6, 5, 4, 5, 5, 6, 5, 5, 4, 5, 5, 5, 5], '#38bdf8', '#082f49', 10);
buildChart('chart-freq', [5, 6, 5, 4, 5, 7, 6, 5, 4, 5, 6, 8, 7, 6, 5, 5, 6, 7, 6, 5, 6, 7, 8, 8], '#a78bfa', '#2e1065', 10);
buildChart('chart-energy', [2, 5, 7, 9, 12, 16, 21, 27, 33, 38, 43, 48, 52, 57, 61, 65, 70, 74, 78, 81, 83, 85, 87, 89], '#10b981', '#052e16');
