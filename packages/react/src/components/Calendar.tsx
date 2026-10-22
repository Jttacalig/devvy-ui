import { forwardRef, useId, useMemo, useRef, useState, type HTMLAttributes } from 'react';
import { dateShift, validDate, useValue } from '../lib/widgets';
export interface CalendarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  label: string;
  month: string;
  onMonthChange: (month: string) => void;
  value?: string;
  defaultValue?: string;
  onValueChange?: (date: string) => void;
  min?: string;
  max?: string;
  locale?: string;
  weekStartsOn?: 0 | 1;
  disabled?: boolean;
}
export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(function Calendar(
  {
    label,
    month,
    onMonthChange,
    value,
    defaultValue = '',
    onValueChange,
    min,
    max,
    locale = 'en',
    weekStartsOn = 1,
    disabled,
    dir = 'ltr',
    className,
    ...props
  },
  ref,
) {
  const formats = useMemo(
    () => ({
      month: new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }),
      full: new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeZone: 'UTC' }),
      weekday: new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' }),
      short: new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' }),
    }),
    [locale],
  );
  const first = month + '-01';
  if (!validDate(first)) throw new Error('Calendar month must be a valid YYYY-MM.');
  const [selected, setSelected] = useValue(value, defaultValue, onValueChange),
    [focused, setFocused] = useState(selected.startsWith(month) ? selected : first),
    buttons = useRef(new Map<string, HTMLButtonElement>()),
    id = useId();
  const offset = (new Date(first + 'T12:00:00Z').getUTCDay() - weekStartsOn + 7) % 7,
    start = dateShift(first, -offset);
  const dates = Array.from({ length: 42 }, (_, i) => dateShift(start, i));
  const allowed = (day: string) =>
    validDate(day) && !disabled && (!min || day >= min) && (!max || day <= max);
  const previous = dateShift(first, -1).slice(0, -3),
    next = dateShift(first, 32).slice(0, -3);
  const title = formats.month.format(new Date(first + 'T12:00:00Z'));
  const focus = (day: string) => {
    if (!allowed(day)) return;
    setFocused(day);
    if (!day.startsWith(month)) onMonthChange(day.slice(0, 7));
    requestAnimationFrame(() => buttons.current.get(day)?.focus());
  };
  return (
    <div
      {...props}
      ref={ref}
      dir={dir}
      className={['dvy-calendar', className].filter(Boolean).join(' ')}
      aria-label={label}
    >
      <div className="dvy-calendar-heading">
        <button
          type="button"
          aria-label="Previous month"
          disabled={
            disabled || !validDate(previous + '-01') || !!(min && previous < min.slice(0, 7))
          }
          onClick={() => onMonthChange(previous)}
        >
          ‹
        </button>
        <span id={id} aria-live="polite">
          {title}
        </span>
        <button
          type="button"
          aria-label="Next month"
          disabled={disabled || !validDate(next + '-01') || !!(max && next > max.slice(0, 7))}
          onClick={() => onMonthChange(next)}
        >
          ›
        </button>
      </div>
      <table role="grid" aria-labelledby={id}>
        <thead>
          <tr>
            {Array.from({ length: 7 }, (_, i) => (
              <th key={i} scope="col">
                <abbr
                  title={formats.weekday.format(
                    new Date(dateShift('2024-01-07', (i + weekStartsOn) % 7) + 'T12:00:00Z'),
                  )}
                >
                  {formats.short.format(
                    new Date(dateShift('2024-01-07', (i + weekStartsOn) % 7) + 'T12:00:00Z'),
                  )}
                </abbr>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }, (_, row) => (
            <tr key={row}>
              {dates.slice(row * 7, row * 7 + 7).map((day) => (
                <td key={day} role="gridcell" aria-selected={day === selected}>
                  <button
                    type="button"
                    ref={(node) => {
                      if (node) buttons.current.set(day, node);
                      else buttons.current.delete(day);
                    }}
                    disabled={!allowed(day)}
                    tabIndex={
                      day ===
                      (dates.includes(focused) && allowed(focused)
                        ? focused
                        : dates.find((d) => d.startsWith(month) && allowed(d)))
                        ? 0
                        : -1
                    }
                    aria-label={formats.full.format(new Date(day + 'T12:00:00Z'))}
                    data-outside={!day.startsWith(month)}
                    data-selected={day === selected}
                    onFocus={() => setFocused(day)}
                    onClick={() => {
                      setSelected(day);
                      if (!day.startsWith(month)) onMonthChange(day.slice(0, 7));
                    }}
                    onKeyDown={(event) => {
                      let step =
                        event.key === 'ArrowDown'
                          ? 7
                          : event.key === 'ArrowUp'
                            ? -7
                            : event.key === 'ArrowRight'
                              ? dir === 'rtl'
                                ? -1
                                : 1
                              : event.key === 'ArrowLeft'
                                ? dir === 'rtl'
                                  ? 1
                                  : -1
                                : undefined;
                      if (event.key === 'Home')
                        step = -((new Date(day + 'T12:00:00Z').getUTCDay() - weekStartsOn + 7) % 7);
                      if (event.key === 'End')
                        step =
                          6 - ((new Date(day + 'T12:00:00Z').getUTCDay() - weekStartsOn + 7) % 7);
                      if (event.key === 'PageUp' || event.key === 'PageDown') {
                        event.preventDefault();
                        const target = new Date(day + 'T12:00:00Z');
                        const originalDay = target.getUTCDate();
                        target.setUTCDate(1);
                        target.setUTCMonth(
                          target.getUTCMonth() +
                            (event.key === 'PageUp' ? -1 : 1) * (event.shiftKey ? 12 : 1),
                        );
                        const end = new Date(target);
                        end.setUTCMonth(end.getUTCMonth() + 1, 0);
                        target.setUTCDate(Math.min(originalDay, end.getUTCDate()));
                        focus(target.toISOString().split('T')[0]);
                      } else if (step !== undefined) {
                        event.preventDefault();
                        focus(dateShift(day, step));
                      }
                    }}
                  >
                    {Number(day.slice(-2))}
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
