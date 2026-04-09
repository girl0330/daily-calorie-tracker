const colorTokens = [
    { name: "Primary / 1", value: "#C47E35", cssVar: "var(--primary-1)" },
    { name: "Primary / 2", value: "#DCA15D", cssVar: "var(--primary-2)" },
    { name: "Primary / 3", value: "#DABB94", cssVar: "var(--primary-3)" },
    { name: "Primary / 4", value: "#F3DABC", cssVar: "var(--primary-4)" },
    { name: "Primary / 5", value: "#FAF1E5", cssVar: "var(--primary-5)" },

    { name: "Neutral / 1", value: "#2C2C2C", cssVar: "var(--neutral-1)" },
    { name: "Neutral / 2", value: "#434343", cssVar: "var(--neutral-2)" },
    { name: "Neutral / 3", value: "#94868B", cssVar: "var(--neutral-3)" },
    { name: "Neutral / 4", value: "#D9CFD3", cssVar: "var(--neutral-4)" },
    { name: "Neutral / 5", value: "#F2ECEE", cssVar: "var(--neutral-5)" },

    { name: "Accent / 1", value: "#458179", cssVar: "var(--accent-1)" },
    { name: "Accent / 2", value: "#4DA296", cssVar: "var(--accent-2)" },
    { name: "Accent / 3", value: "#8DD8CF", cssVar: "var(--accent-3)" },
    { name: "Accent / 4", value: "#92CFC7", cssVar: "var(--accent-4)" },
    { name: "Accent / 5", value: "#D7F2EF", cssVar: "var(--accent-5)" },
]

const fontTokens = [
    { label: "Font 2XL / 32px", cssVar: "var(--font-2xl)", size: "var(--font-2xl)" },
    { label: "Font XL / 24px", cssVar: "var(--font-xl)", size: "var(--font-xl)" },
    { label: "Font LG / 20px", cssVar: "var(--font-lg)", size: "var(--font-lg)" },
    { label: "Font MD / 16px", cssVar: "var(--font-md)", size: "var(--font-md)" },
    { label: "Font SM / 14px", cssVar: "var(--font-sm)", size: "var(--font-sm)" },
]

const spaceTokens = [
    { label: "XS", value: "4px", width: "var(--space-xs)" },
    { label: "SM", value: "8px", width: "var(--space-sm)" },
    { label: "MD", value: "12px", width: "var(--space-md)" },
    { label: "LG", value: "16px", width: "var(--space-lg)" },
    { label: "XL", value: "20px", width: "var(--space-xl)" },
    { label: "2XL", value: "30px", width: "var(--space-2xl)" },
    { label: "3XL", value: "40px", width: "var(--space-3xl)" },
]

export default function StylePage() {
    return (
        <>
            <main className="style-page">
                <section className="style-hero">
                    <h1>Style Guide</h1>
                    <p>디자인 토큰이 실제 화면에서 어떻게 보이는지 확인하는 페이지</p>
                </section>

                <section className="style-section">
                    <h2>Colors</h2>
                    <div className="token-grid">
                        {colorTokens.map((token) => (
                            <div key={token.name} className="color-card">
                                <div
                                    className="color-swatch"
                                    style={{ background: token.cssVar }}
                                />
                                <div className="color-info">
                                    <div className="color-name">{token.name}</div>
                                    <div className="color-value">{token.value}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="style-section">
                    <h2>Typography</h2>
                    <div className="style-panel type-stack">
                        {fontTokens.map((token) => (
                            <div key={token.label} className="type-row">
                                <div style={{ fontSize: token.size }}>{token.label}</div>
                                <div className="type-meta">{token.cssVar}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="style-section">
                    <h2>Spacing</h2>
                    <div className="style-panel space-stack">
                        {spaceTokens.map((token) => (
                            <div key={token.label} className="space-row">
                                <strong>{token.label}</strong>
                                <span>{token.value}</span>
                                <div className="space-bar" style={{ width: token.width }} />
                            </div>
                        ))}
                    </div>
                </section>

                <section className="style-section">
                    <h2>Radius</h2>
                    <div className="radius-grid">
                        <div className="demo-box radius-sm">
                            Radius SM
                            <div className="token-label">var(--radius-sm) / 3px</div>
                        </div>
                        <div className="demo-box radius-md">
                            Radius MD
                            <div className="token-label">var(--radius-md) / 8px</div>
                        </div>
                    </div>
                </section>

                <section className="style-section">
                    <h2>Shadows</h2>
                    <div className="shadow-grid">
                        <div className="demo-box radius-md shadow-sm">
                            Shadow SM
                            <div className="token-label">var(--shadow-sm)</div>
                        </div>
                        <div className="demo-box radius-md shadow-md">
                            Shadow MD
                            <div className="token-label">var(--shadow-md)</div>
                        </div>
                        <div className="demo-box radius-md shadow-navbar-demo">
                            Navbar Shadow
                            <div className="token-label">var(--shadow-navbar)</div>
                        </div>
                    </div>
                </section>

                <section className="style-section">
                    <h2>Buttons</h2>
                    <div className="style-panel button-grid">
                        <div>
                            <button className="btn btn-default">Default</button>
                            <div className="token-label">Primary button</div>
                        </div>
                        <div>
                            <button className="btn btn-outline">Outline</button>
                            <div className="token-label">Outline button</div>
                        </div>
                        <div>
                            <button className="btn btn-active">Active</button>
                            <div className="token-label">Active state</div>
                        </div>
                    </div>
                </section>

                <section className="style-section">
                    <h2>Card Preview</h2>
                    <div className="card-preview">
                        <h3>Chicken Salad</h3>
                        <p>320 calories</p>
                        <ul className="macro-list">
                            <li className="macro-carbs">Carbs 24g</li>
                            <li className="macro-protein">Protein 28g</li>
                            <li className="macro-fat">Fat 10g</li>
                        </ul>
                    </div>
                </section>

                <section className="style-section">
                    <h2>Layout</h2>
                    <div className="layout-grid">
                        <div className="layout-demo">
                            <label className="label">Container width</label>
                            <div className="container-demo">
                                max-width: var(--container-width)
                            </div>
                        </div>

                        <div className="layout-demo">
                            <label className="label">Input width</label>
                            <input
                                className="input-demo"
                                placeholder="max-width: var(--input-width)"
                            />
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}