import React from 'react';
import {
  DesignSystemProvider,
  DesignSystemThemeProvider,
  Button,
  Header
} from '@databricks/design-system';
import '@databricks/design-system/dist/index.css';
import './TypographyShowcase.css';

const TypographyShowcase = () => {
  return (
    <DesignSystemProvider>
      <DesignSystemThemeProvider>
        <div className="typography-showcase">
          <Header title="Typography Showcase" />
          
          <div className="showcase-content">
            {/* Headings */}
            <section className="typography-section">
              <h2 className="section-title">Headings</h2>
              <div className="typography-examples">
                <div className="example">
                  <h1 className="typography-h1">Heading 1 - Large Title</h1>
                  <code>variant="h1"</code>
                </div>
                <div className="example">
                  <h2 className="typography-h2">Heading 2 - Title</h2>
                  <code>variant="h2"</code>
                </div>
                <div className="example">
                  <h3 className="typography-h3">Heading 3 - Subtitle</h3>
                  <code>variant="h3"</code>
                </div>
                <div className="example">
                  <h4 className="typography-h4">Heading 4 - Section</h4>
                  <code>variant="h4"</code>
                </div>
                <div className="example">
                  <h5 className="typography-h5">Heading 5 - Subsection</h5>
                  <code>variant="h5"</code>
                </div>
                <div className="example">
                  <h6 className="typography-h6">Heading 6 - Small Title</h6>
                  <code>variant="h6"</code>
                </div>
              </div>
            </section>

            {/* Body Text */}
            <section className="typography-section">
              <h2 className="section-title">Body Text</h2>
              <div className="typography-examples">
                <div className="example">
                  <p className="typography-body">Body - Regular paragraph text</p>
                  <code>variant="body"</code>
                </div>
                <div className="example">
                  <p className="typography-body typography-semibold">Body - Semibold paragraph text</p>
                  <code>variant="body" weight="semibold"</code>
                </div>
                <div className="example">
                  <p className="typography-body typography-bold">Body - Bold paragraph text</p>
                  <code>variant="body" weight="bold"</code>
                </div>
              </div>
            </section>

            {/* Small Text */}
            <section className="typography-section">
              <h2 className="section-title">Small Text</h2>
              <div className="typography-examples">
                <div className="example">
                  <p className="typography-small">Small - Caption and helper text</p>
                  <code>variant="small"</code>
                </div>
                <div className="example">
                  <p className="typography-small typography-semibold">Small - Semibold caption text</p>
                  <code>variant="small" weight="semibold"</code>
                </div>
                <div className="example">
                  <p className="typography-small typography-bold">Small - Bold caption text</p>
                  <code>variant="small" weight="bold"</code>
                </div>
              </div>
            </section>

            {/* Code Text */}
            <section className="typography-section">
              <h2 className="section-title">Code Text</h2>
              <div className="typography-examples">
                <div className="example">
                  <code className="typography-code">Code - Inline code text</code>
                  <code>variant="code"</code>
                </div>
                <div className="example">
                  <code className="typography-code typography-semibold">Code - Semibold code text</code>
                  <code>variant="code" weight="semibold"</code>
                </div>
              </div>
            </section>

            {/* Link Text */}
            <section className="typography-section">
              <h2 className="section-title">Link Text</h2>
              <div className="typography-examples">
                <div className="example">
                  <a href="#" className="typography-link">Link - Clickable link text</a>
                  <code>variant="link"</code>
                </div>
                <div className="example">
                  <a href="#" className="typography-link typography-semibold">Link - Semibold link text</a>
                  <code>variant="link" weight="semibold"</code>
                </div>
              </div>
            </section>

            {/* Different Weights */}
            <section className="typography-section">
              <h2 className="section-title">Font Weights</h2>
              <div className="typography-examples">
                <div className="example">
                  <p className="typography-body typography-regular">Regular weight text</p>
                  <code>weight="regular"</code>
                </div>
                <div className="example">
                  <p className="typography-body typography-medium">Medium weight text</p>
                  <code>weight="medium"</code>
                </div>
                <div className="example">
                  <p className="typography-body typography-semibold">Semibold weight text</p>
                  <code>weight="semibold"</code>
                </div>
                <div className="example">
                  <p className="typography-body typography-bold">Bold weight text</p>
                  <code>weight="bold"</code>
                </div>
              </div>
            </section>

            {/* Color Variants */}
            <section className="typography-section">
              <h2 className="section-title">Color Variants</h2>
              <div className="typography-examples">
                <div className="example">
                  <p className="typography-body typography-color-primary">Primary color text</p>
                  <code>color="primary"</code>
                </div>
                <div className="example">
                  <p className="typography-body typography-color-secondary">Secondary color text</p>
                  <code>color="secondary"</code>
                </div>
                <div className="example">
                  <p className="typography-body typography-color-success">Success color text</p>
                  <code>color="success"</code>
                </div>
                <div className="example">
                  <p className="typography-body typography-color-warning">Warning color text</p>
                  <code>color="warning"</code>
                </div>
                <div className="example">
                  <p className="typography-body typography-color-danger">Danger color text</p>
                  <code>color="danger"</code>
                </div>
              </div>
            </section>
          </div>
        </div>
      </DesignSystemThemeProvider>
    </DesignSystemProvider>
  );
};

export default TypographyShowcase; 