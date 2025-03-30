"use client";
import {createRoot} from 'react-dom/client'
import Markdown from 'react-markdown';
import markdown from '!!raw-loader!./meter.md';

export default function Meter(){

    return (
        
        <main style={{ maxWidth: '800px', margin: 'auto', paddingLeft: 20, paddingRight: 20 }} >
            <div>
                <Markdown>{markdown}</Markdown>
            </div>

        </main>

    );
}