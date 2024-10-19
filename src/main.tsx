import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Test from './example';
import "../.cachier.config.ts";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Test />
    </StrictMode>,
);