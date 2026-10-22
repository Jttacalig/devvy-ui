import { forwardRef, useId, useRef, useState, type HTMLAttributes } from 'react';
import { useValue } from '../lib/widgets';
export interface TreeNode {
  id: string;
  label: string;
  disabled?: boolean;
  children?: readonly TreeNode[];
}
export interface TreeViewProps
  extends Omit<HTMLAttributes<HTMLUListElement>, 'defaultValue' | 'onChange'> {
  label: string;
  items: readonly TreeNode[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  defaultExpanded?: readonly string[];
}
export const TreeView = forwardRef<HTMLUListElement, TreeViewProps>(function TreeView(
  {
    label,
    items,
    value,
    defaultValue = '',
    onValueChange,
    defaultExpanded = [],
    className,
    dir = 'ltr',
    ...props
  },
  ref,
) {
  const id = useId();
  const [selected, setSelected] = useValue(value, defaultValue, onValueChange),
    [expanded, setExpanded] = useState<readonly string[]>(defaultExpanded),
    [focused, setFocused] = useState(''),
    nodes = useRef(new Map<string, HTMLDivElement>());
  const visible: { item: TreeNode; parent?: string }[] = [];
  const flatten = (list: readonly TreeNode[], parent?: string) => {
    for (const item of list) {
      if (!item.disabled) visible.push({ item, parent });
      if (item.children && expanded.includes(item.id)) flatten(item.children, item.id);
    }
  };
  flatten(items);
  const tab = visible.some((v) => v.item.id === focused)
    ? focused
    : (visible.find((v) => v.item.id === selected)?.item.id ?? visible[0]?.item.id);
  const focus = (id: string | undefined) => {
    if (id) {
      setFocused(id);
      nodes.current.get(id)?.focus();
    }
  };
  const toggle = (id: string) =>
    setExpanded(expanded.includes(id) ? expanded.filter((v) => v !== id) : [...expanded, id]);
  const render = (list: readonly TreeNode[], level: number) => (
    <>
      {list.map((item, index) => (
        <li key={item.id} role="none">
          <div
            ref={(node) => {
              if (node) nodes.current.set(item.id, node);
              else nodes.current.delete(item.id);
            }}
            role="treeitem"
            aria-labelledby={id + '-label-' + encodeURIComponent(item.id)}
            aria-owns={
              item.children?.length && expanded.includes(item.id)
                ? id + '-group-' + encodeURIComponent(item.id)
                : undefined
            }
            aria-level={level}
            aria-posinset={index + 1}
            aria-setsize={list.length}
            aria-disabled={item.disabled || undefined}
            aria-expanded={item.children?.length ? expanded.includes(item.id) : undefined}
            aria-selected={selected === item.id}
            tabIndex={item.id === tab ? 0 : -1}
            onFocus={(event) => {
              if (event.target === event.currentTarget) setFocused(item.id);
            }}
            onClick={(event) => {
              if (event.defaultPrevented) return;
              if (item.disabled) return;
              setSelected(item.id);
              if (item.children?.length) toggle(item.id);
            }}
            onKeyDown={(event) => {
              event.stopPropagation();
              if (item.disabled) return;
              const index = visible.findIndex((v) => v.item.id === item.id),
                forward = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight',
                back = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
              if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                focus(
                  visible[
                    Math.max(
                      0,
                      Math.min(visible.length - 1, index + (event.key === 'ArrowDown' ? 1 : -1)),
                    )
                  ]?.item.id,
                );
              } else if (event.key === 'Home' || event.key === 'End') {
                event.preventDefault();
                focus((event.key === 'Home' ? visible[0] : visible[visible.length - 1])?.item.id);
              } else if (event.key === forward && item.children?.length) {
                event.preventDefault();
                if (!expanded.includes(item.id)) toggle(item.id);
                else focus(item.children.find((v) => !v.disabled)?.id);
              } else if (event.key === back) {
                event.preventDefault();
                if (expanded.includes(item.id)) toggle(item.id);
                else focus(visible[index]?.parent);
              } else if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setSelected(item.id);
              } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
                const next = [...visible.slice(index + 1), ...visible.slice(0, index + 1)].find(
                  (v) => v.item.label.toLocaleLowerCase().startsWith(event.key.toLocaleLowerCase()),
                );
                if (next) {
                  event.preventDefault();
                  focus(next.item.id);
                }
              }
            }}
          >
            <span className="dvy-tree-label" id={id + '-label-' + encodeURIComponent(item.id)}>
              {item.children?.length ? (
                <span aria-hidden="true">{expanded.includes(item.id) ? '−' : '+'}</span>
              ) : null}
              {item.label}
            </span>
          </div>
          {item.children?.length && expanded.includes(item.id) ? (
            <ul role="group" id={id + '-group-' + encodeURIComponent(item.id)}>
              {render(item.children, level + 1)}
            </ul>
          ) : null}
        </li>
      ))}
    </>
  );
  return (
    <ul
      {...props}
      ref={ref}
      role="tree"
      aria-label={label}
      dir={dir}
      className={['dvy-tree', className].filter(Boolean).join(' ')}
    >
      {render(items, 1)}
    </ul>
  );
});
