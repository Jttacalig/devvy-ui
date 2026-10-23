'use client';

import { useState, type CSSProperties } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Switch, Slider, Badge, Glass } from '@devvy-ui/react';
import '@devvy-ui/styles/glass.css';
import { InterfaceIcon } from './InterfaceIcon';
import { LandingCard } from './LandingCard';

export function HeroGlassCard() {
  const [switchActive, setSwitchActive] = useState(true);
  const [sliderValue, setSliderValue] = useState(72);

  return (
    <LandingCard
      className="hero-glass-card"
      label="DEVVY GLASS interactive showcase"
      category="Material"
      title="A little depth. Your way."
      description="Adaptive Glass, with a solid foundation."
      footer={
        <Link className="component-example-link" href="/ui/glass">
          Meet DEVVY GLASS <span aria-hidden="true">↗</span>
        </Link>
      }
    >
      <div className="hero-glass-stage">
        <Glass
          quality="auto"
          enabled={switchActive}
          className="hero-glass-viewport"
          style={{ '--dvy-glass-opacity': sliderValue / 100 } as CSSProperties}
        >
          {/* Layer 1: Wordmark Frosted Surface */}
          <div className="hero-glass-layer hero-glass-layer-brand dvy-glass-surface">
            <span className="hero-glass-logo">
              <Image src="/devvy-logo.png" alt="" width={28} height={28} priority />
            </span>
            <span className="hero-glass-wordmark">
              devvy<span className="hero-glass-ui">ui</span>
            </span>
            <Badge tone="brand" className="hero-glass-pill">
              GLASS
            </Badge>
          </div>

          {/* Layer 2: Solid Brand Button */}
          <div className="hero-glass-layer hero-glass-layer-btn">
            <Button
              variant="solid"
              tone="brand"
              size="md"
              onClick={() => setSwitchActive((value) => !value)}
            >
              {switchActive ? 'Switch to solid' : 'Try the glass'}
            </Button>
          </div>

          {/* Layer 3: Interactive Controls (Switch, Slider, Icons) */}
          <div className="hero-glass-layer hero-glass-layer-controls dvy-glass-surface">
            <div className="hero-glass-icon-group">
              <span className="hero-glass-icon-box" aria-hidden="true">
                <InterfaceIcon name="home" />
              </span>
              <span className="hero-glass-icon-box" aria-hidden="true">
                <InterfaceIcon name="heart" />
              </span>
              <span className="hero-glass-icon-box" aria-hidden="true">
                <InterfaceIcon name="star" />
              </span>
            </div>

            <div className="hero-glass-toggles">
              <div className="hero-glass-switch-wrap">
                <Switch
                  id="hero-glass-switch"
                  checked={switchActive}
                  onChange={(e) => setSwitchActive(e.target.checked)}
                  aria-label="Toggle showcase material"
                />
              </div>
              <div className="hero-glass-slider-wrap">
                <Slider
                  id="hero-glass-slider"
                  label="Showcase opacity"
                  min={72}
                  max={100}
                  value={sliderValue}
                  onChange={(e) => setSliderValue(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </Glass>
      </div>
    </LandingCard>
  );
}
