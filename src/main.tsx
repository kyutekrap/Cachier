import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import GlobalUserTest from './example'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <GlobalUserTest />
    </StrictMode>,
)
