import { forwardRef } from 'react';
import { Combobox, type ComboboxProps } from './Combobox';
export type AutocompleteProps = Omit<ComboboxProps, 'allowCustom'>;
export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
  function Autocomplete(props, ref) {
    return <Combobox {...props} allowCustom ref={ref} />;
  },
);
