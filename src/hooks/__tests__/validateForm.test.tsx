import { renderHook, act } from '@testing-library/react-hooks';
import { useFormValidation } from '../validateForm';
import { describe, expect, it } from 'vitest';


describe('useFormValidation', () => {
  it('debería actualizar correctamente los valores y errores', () => {
    const { result } = renderHook(() => useFormValidation({
      username: { required: true },
      password: { minLength: 6 }
    }));

    act(() => {
      result.current.handleChange({ target: { name: 'username', value: 'john_doe' } });
    });

    expect(result.current.values.username).toBe('john_doe');
    expect(result.current.errors.username).toBe('');

    act(() => {
      result.current.handleChange({ target: { name: 'password', value: '12345' } });
    });

    expect(result.current.values.password).toBe('12345');
    expect(result.current.errors.password).toBe('Minimum length is 6');
  });

  it('debería validar correctamente el formulario', () => {
    const { result } = renderHook(() => useFormValidation({
      username: { required: true },
      password: { minLength: 6 }
    }));

    act(() => {
      result.current.handleChange({ target: { name: 'username', value: '' } });
      result.current.handleChange({ target: { name: 'password', value: '12345' } });
      result.current.handleSubmit();
    });

    expect(result.current.errors.username).toBe('This field is required');
    expect(result.current.errors.password).toBe('Minimum length is 6');
  });
});
