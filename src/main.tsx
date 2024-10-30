import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Test from './example';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Test />
    </StrictMode>,
);