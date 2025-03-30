'use client';

import {useEffect, useRef} from 'react';

import dynamic from 'next/dynamic';

    const WebViewerComponent = dynamic(() => import('@pdftron/webviewer'), { ssr: false });
   
    export default function convertFiles() {
        const viewer = useRef(null);
        useEffect(() => {
            WebViewerComponent.then(({ default: WebViewer }) => {
              WebViewer(
                {
                  path: '/webviewer', // Ensure this path is correct
                  licenseKey: 'demo:1743288063205:6127cc4203000000007f3fa82f65e8003a56feca8f1a4b4',
                  initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf',
                },
                viewer.current
              ).then((instance) => {
                const { documentViewer } = instance.Core;
                console.log('WebViewer initialized', documentViewer);
              });
            }).catch(console.error);
          }, []);
        
          return (
            <div className="MyComponent">
              <div className="header">React Sample</div>
              <div className="webviewer" ref={viewer} style={{ height: '100vh' }}></div>
            </div>
          );
        }