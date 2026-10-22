'use client';
import {
  forwardRef,
  useId,
  useState,
  type HTMLAttributes,
  type PointerEvent,
  type ReactNode,
  type CSSProperties,
} from 'react';
import { cx } from '../lib/cx';

export interface ChartDatum {
  label: string;
  value: number;
}
export interface ChartProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'children'> {
  title: string;
  description?: string;
  data: readonly ChartDatum[];
  type?: 'bar' | 'line' | 'area' | 'donut';
  valueFormatter?: (value: number) => string;
  axisFormatter?: (value: number) => string;
  curve?: 'linear' | 'smooth' | 'step';
  /** Optional externally selected point; ChartInspector supplies this automatically. */
  activeIndex?: number;
  /** Optional native SVG definitions for application-owned fills. */
  definitions?: ReactNode;
  /** Localize the native disclosure for the complete data table. */
  dataLabel?: string;
  emptyLabel?: string;
}
const formatNumber = (value: number) => String(Number(value.toPrecision(6)));

/** SVG presentation with an equivalent, selectable HTML data table. No chart runtime. */
export const Chart = forwardRef<HTMLElement, ChartProps>(function Chart(
  {
    title,
    description,
    data,
    type = 'bar',
    valueFormatter = formatNumber,
    axisFormatter = valueFormatter,
    curve = 'linear',
    activeIndex,
    definitions,
    dataLabel = 'View data',
    emptyLabel = 'No data to display.',
    className,
    ...props
  },
  ref,
) {
  const id = useId();
  const valid = data.filter((item) => Number.isFinite(item.value));
  const total = valid.reduce((sum, item) => sum + item.value, 0);
  const available =
    valid.length > 0 &&
    (type !== 'donut' ||
      (valid.every((item) => item.value >= 0) && total > 0 && Number.isFinite(total)));
  let minimum = 0,
    maximum = 0;
  for (const { value } of valid) {
    minimum = Math.min(minimum, value);
    maximum = Math.max(maximum, value);
  }
  const magnitude = Math.max(-minimum, maximum, 1);
  // Normalize before subtraction so very large finite values cannot overflow the scale.
  const low = minimum / magnitude;
  const high = maximum / magnitude;
  const span = high - low || 1;
  const y = (value: number) => 204 - ((value / magnitude - low) / span) * 172;
  const x = (index: number) =>
    type === 'bar'
      ? 56 + (index + 0.5) * (480 / valid.length)
      : valid.length === 1
        ? 288
        : 64 + index * (448 / (valid.length - 1));
  const path = valid
    .map((item, index) => {
      const point = `${x(index)},${y(item.value)}`;
      if (!index) return 'M' + point;
      const middle = (x(index - 1) + x(index)) / 2;
      return curve === 'smooth'
        ? `C${middle},${y(valid[index - 1].value)} ${middle},${y(item.value)} ${point}`
        : curve === 'step'
          ? `H${middle}V${y(item.value)}H${x(index)}`
          : 'L' + point;
    })
    .join(' ');
  let offset = 0;
  return (
    <figure {...props} ref={ref} className={cx('dvy-chart', className)} data-type={type}>
      <figcaption className="dvy-chart-heading">
        <strong id={`${id}-title`}>{title}</strong>
        {description && <span id={`${id}-description`}>{description}</span>}
      </figcaption>
      {!available ? (
        <p className="dvy-chart-empty">{emptyLabel}</p>
      ) : (
        <>
          <svg
            className="dvy-chart-plot"
            viewBox="0 0 560 248"
            role="img"
            aria-labelledby={`${id}-title`}
            aria-describedby={description ? `${id}-description` : undefined}
          >
            <title>{title}</title>
            {definitions}

            {type === 'donut' ? (
              <g transform="translate(280 124) rotate(-90)">
                <circle r="82" fill="none" className="dvy-chart-track" strokeWidth="28" />
                {valid.map((item, index) => {
                  const fraction = item.value / total;
                  const start = offset;
                  offset += fraction;
                  return (
                    <circle
                      key={index}
                      r="82"
                      fill="none"
                      pathLength="100"
                      className="dvy-chart-segment"
                      data-shade={index % 4}
                      strokeWidth="28"
                      strokeDasharray={`${fraction * 100} ${100 - fraction * 100}`}
                      strokeDashoffset={-start * 100}
                    >
                      <title>{`${item.label}: ${valueFormatter(item.value)}`}</title>
                    </circle>
                  );
                })}
              </g>
            ) : (
              <>
                {[0, 1, 2, 3, 4].map((tick) => {
                  const value = (low + (span * tick) / 4) * magnitude;
                  const position = 204 - tick * 43;
                  return (
                    <g key={tick} className="dvy-chart-grid">
                      <line x1="56" x2="536" y1={position} y2={position} />
                      <text x="48" y={position + 4} textAnchor="end">
                        {axisFormatter(value)}
                      </text>
                    </g>
                  );
                })}
                <line className="dvy-chart-baseline" x1="56" x2="536" y1={y(0)} y2={y(0)} />
                {type === 'bar' ? (
                  valid.map((item, index) => {
                    const slot = 480 / valid.length;
                    return (
                      <rect
                        key={index}
                        className="dvy-chart-bar"
                        data-active={activeIndex === index || undefined}
                        x={56 + index * slot + slot * 0.2}
                        width={slot * 0.6}
                        y={Math.min(y(0), y(item.value))}
                        height={Math.abs(y(item.value) - y(0))}
                        rx="3"
                      >
                        <title>{`${item.label}: ${valueFormatter(item.value)}`}</title>
                      </rect>
                    );
                  })
                ) : (
                  <>
                    {type === 'area' && (
                      <path
                        className="dvy-chart-area"
                        d={`${path} L${x(valid.length - 1)},${y(0)} L${x(0)},${y(0)} Z`}
                      />
                    )}
                    <path className="dvy-chart-line" d={path} />
                    {valid.map((item, index) => (
                      <circle
                        key={index}
                        className="dvy-chart-point"
                        data-active={activeIndex === index || undefined}
                        cx={x(index)}
                        cy={y(item.value)}
                        r="4"
                      >
                        <title>{`${item.label}: ${valueFormatter(item.value)}`}</title>
                      </circle>
                    ))}
                  </>
                )}
                {activeIndex !== undefined && valid[activeIndex] && (
                  <path className="dvy-chart-cursor" d={`M${x(activeIndex)},24V208`} />
                )}
                {valid.map((item, index) => {
                  const stride = Math.max(1, Math.ceil(valid.length / 6));
                  if (index % stride !== 0 && index !== valid.length - 1) return null;
                  return (
                    <text
                      key={index}
                      className="dvy-chart-axis"
                      x={x(index)}
                      y="232"
                      textAnchor="middle"
                    >
                      {item.label.length > 9 ? item.label.slice(0, 8) + '…' : item.label}
                    </text>
                  );
                })}
              </>
            )}
          </svg>
          {type === 'donut' && (
            <ul className="dvy-chart-legend">
              {valid.map((item, index) => (
                <li key={index}>
                  <span className="dvy-chart-key" data-shade={index % 4} aria-hidden="true" />
                  <span>{item.label}</span>
                  <strong>{valueFormatter(item.value)}</strong>
                </li>
              ))}
            </ul>
          )}
          <details className="dvy-chart-data">
            <summary>{dataLabel}</summary>
            <div className="dvy-chart-table">
              <table>
                <caption>{title}</caption>
                <thead>
                  <tr>
                    <th scope="col">Label</th>
                    <th scope="col">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {valid.map((item, index) => (
                    <tr key={index}>
                      <th scope="row">{item.label}</th>
                      <td>{valueFormatter(item.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </>
      )}
    </figure>
  );
});

export interface ChartInspectorProps extends Omit<ChartProps, 'activeIndex' | 'definitions'> {
  defaultIndex?: number;
  inspectionLabel?: string;
}

/** Optional inspection composition. Chart alone does not subscribe to pointer events. */
export function ChartInspector({
  data,
  defaultIndex = 0,
  inspectionLabel = 'Inspect data',
  valueFormatter = formatNumber,
  ...props
}: ChartInspectorProps) {
  const valid = data.filter((item) => Number.isFinite(item.value));
  const [selected, setSelected] = useState(defaultIndex);
  const index = Math.max(
    0,
    Math.min(valid.length - 1, Number.isFinite(selected) ? Math.round(selected) : 0),
  );
  const point = valid[index];
  const id = useId();
  const inspect = (event: PointerEvent<HTMLDivElement>) => {
    if (props.type === 'donut' || !valid.length) return;
    const svg = (event.target as Element).closest('svg');
    if (!svg) return;
    const bounds = svg.getBoundingClientRect();
    const position = (((event.clientX - bounds.left) / bounds.width) * 560 - 64) / 448;
    const next = Math.max(0, Math.min(valid.length - 1, Math.round(position * (valid.length - 1))));
    if (next !== index) setSelected(next);
  };
  return (
    <div className="dvy-chart-inspector" onPointerMove={inspect} onPointerDown={inspect}>
      <Chart
        {...props}
        data={data}
        valueFormatter={valueFormatter}
        activeIndex={index}
        style={{ '--dvy-chart-fill': `url(#${id}-gradient)`, ...props.style } as CSSProperties}
        definitions={
          <defs>
            <linearGradient id={id + '-gradient'} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--dvy-chart-color, var(--dvy-brand))"
                stopOpacity="0.32"
              />
              <stop
                offset="100%"
                stopColor="var(--dvy-chart-color, var(--dvy-brand))"
                stopOpacity="0.02"
              />
            </linearGradient>
          </defs>
        }
      />
      {point && (
        <div className="dvy-chart-inspection">
          <label htmlFor={id}>{inspectionLabel}</label>
          <input
            id={id}
            type="range"
            min={0}
            max={valid.length - 1}
            step={1}
            value={index}
            disabled={valid.length < 2}
            aria-valuetext={point.label + ': ' + valueFormatter(point.value)}
            onChange={(event) => setSelected(event.target.valueAsNumber)}
          />
          <output htmlFor={id}>
            <span>{point.label}</span>
            <strong>{valueFormatter(point.value)}</strong>
          </output>
        </div>
      )}
    </div>
  );
}
