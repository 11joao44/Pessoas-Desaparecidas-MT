// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

// Este hook recebe um valor e um delay
export function useDebounce<T>(value: T, delay: number): T {
  // Estado para armazenar o valor "atrasado" (debounced)
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Cria um temporizador que só vai atualizar o estado
    // depois que o 'delay' tiver passado sem que o 'value' mude
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpa o temporizador se o 'value' mudar antes do delay terminar
    // Isso é o que "reseta" a contagem
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Roda o efeito novamente se o valor ou o delay mudarem

  return debouncedValue;
}
