import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { CmsProvider } from './cms/CmsContext';
import './styles.css';
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><CmsProvider><BrowserRouter><App /></BrowserRouter></CmsProvider></React.StrictMode>);
