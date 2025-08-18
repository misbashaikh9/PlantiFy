import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import '../styles/MagazinePage.css';

const MagazinePage = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="magazine-page">
      <Header />
      
      <main className="magazine-main">
        <div className="magazine-header">
          <button className="back-btn" onClick={handleBackToHome}>
            ← Back to Home
          </button>
          <h1>🌱 Plant Care Magazine</h1>
          <p>Your complete guide to plant care, fertilizers, and seasonal tips</p>
        </div>

        <div className="magazine-content">
          {/* Plant Care Basics Section */}
          <section className="magazine-section">
            <div className="section-header">
              <div className="section-icon">🌿</div>
              <h2>Plant Care Basics</h2>
            </div>
            
            <div className="content-grid">
              <div className="content-card">
                <h3>💧 Watering Guide</h3>
                <ul>
                  <li><strong>Check soil moisture:</strong> Stick finger 1-2 inches deep</li>
                  <li><strong>Water when:</strong> Top soil feels dry to touch</li>
                  <li><strong>Water thoroughly:</strong> Until water drains from bottom</li>
                  <li><strong>Frequency:</strong> Varies by plant type and season</li>
                  <li><strong>Best time:</strong> Morning to allow leaves to dry</li>
                  <li><strong>Water type:</strong> Room temperature, not cold</li>
                </ul>
              </div>
              
              <div className="content-card">
                <h3>☀️ Light Requirements</h3>
                <ul>
                  <li><strong>Bright Indirect:</strong> Near window, no direct sun</li>
                  <li><strong>Medium Light:</strong> 3-6 feet from bright window</li>
                  <li><strong>Low Light:</strong> North-facing or interior rooms</li>
                  <li><strong>Direct Sun:</strong> South/west windows, 6+ hours</li>
                  <li><strong>Signs of too much light:</strong> Scorched, bleached leaves</li>
                  <li><strong>Signs of too little light:</strong> Leggy growth, small leaves</li>
                </ul>
              </div>
              
              <div className="content-card">
                <h3>🌡️ Temperature & Humidity</h3>
                <ul>
                  <li><strong>Ideal range:</strong> 65-75°F (18-24°C)</li>
                  <li><strong>Humidity:</strong> 40-60% for most plants</li>
                  <li><strong>Avoid:</strong> Drafts, AC vents, heaters</li>
                  <li><strong>Seasonal:</strong> Reduce watering in winter</li>
                  <li><strong>Humidity boost:</strong> Group plants together</li>
                  <li><strong>Pebble tray:</strong> Place pot on tray with water</li>
                </ul>
              </div>
              
              <div className="content-card">
                <h3>🌱 Repotting Tips</h3>
                <ul>
                  <li><strong>When to repot:</strong> Roots growing through drainage holes</li>
                  <li><strong>Best time:</strong> Spring or early summer</li>
                  <li><strong>Pot size:</strong> Only 1-2 inches larger</li>
                  <li><strong>Soil:</strong> Use well-draining potting mix</li>
                  <li><strong>Drainage:</strong> Always use pots with holes</li>
                  <li><strong>Root check:</strong> Trim dead or rotting roots</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Fertilizer Guide Section */}
          <section className="magazine-section">
            <div className="section-header">
              <div className="section-icon">🌱</div>
              <h2>Fertilizer Guide</h2>
            </div>
            
            <div className="content-grid">
              <div className="content-card">
                <h3>🌿 NPK Balanced Fertilizer</h3>
                <ul>
                  <li><strong>Ratio:</strong> 10-10-10 or 20-20-20</li>
                  <li><strong>Best for:</strong> Most houseplants</li>
                  <li><strong>Frequency:</strong> Every 2-4 weeks during growth</li>
                  <li><strong>Application:</strong> Dilute in water, apply to soil</li>
                  <li><strong>N (Nitrogen):</strong> Promotes leaf growth</li>
                  <li><strong>P (Phosphorus):</strong> Encourages root development</li>
                  <li><strong>K (Potassium):</strong> Improves overall health</li>
                </ul>
              </div>
              
              <div className="content-card">
                <h3>🌺 Blooming Plant Fertilizer</h3>
                <ul>
                  <li><strong>Ratio:</strong> 15-30-15 (high phosphorus)</li>
                  <li><strong>Best for:</strong> Flowering plants, orchids</li>
                  <li><strong>Frequency:</strong> Every 2 weeks when blooming</li>
                  <li><strong>Tip:</strong> Promotes flower production</li>
                  <li><strong>When to use:</strong> During bud formation</li>
                  <li><strong>Stop when:</strong> Flowers begin to fade</li>
                </ul>
              </div>
              
              <div className="content-card">
                <h3>🌱 Organic Options</h3>
                <ul>
                  <li><strong>Fish Emulsion:</strong> Rich in nitrogen</li>
                  <li><strong>Seaweed Extract:</strong> Growth hormones & nutrients</li>
                  <li><strong>Compost Tea:</strong> Natural, gentle feeding</li>
                  <li><strong>Worm Castings:</strong> Slow-release nutrients</li>
                  <li><strong>Banana Peels:</strong> High in potassium</li>
                  <li><strong>Eggshells:</strong> Calcium source for plants</li>
                </ul>
              </div>
              
              <div className="content-card">
                <h3>⚠️ Fertilizer Safety</h3>
                <ul>
                  <li><strong>Never over-fertilize:</strong> Can burn roots</li>
                  <li><strong>Dilute properly:</strong> Follow package instructions</li>
                  <li><strong>Apply to moist soil:</strong> Prevents root damage</li>
                  <li><strong>Skip in winter:</strong> Plants are dormant</li>
                  <li><strong>Test on one plant:</strong> Before using on all</li>
                  <li><strong>Flush soil:</strong> If over-fertilization occurs</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Seasonal Care Section */}
          <section className="magazine-section">
            <div className="section-header">
              <div className="section-icon">🍂</div>
              <h2>Seasonal Care</h2>
            </div>
            
            <div className="content-grid">
              <div className="content-card">
                <h3>🌸 Spring (March-May)</h3>
                <ul>
                  <li><strong>Increase watering:</strong> As growth resumes</li>
                  <li><strong>Start fertilizing:</strong> With balanced fertilizer</li>
                  <li><strong>Repot if needed:</strong> Best time for repotting</li>
                  <li><strong>Move outdoors:</strong> Gradually acclimate plants</li>
                  <li><strong>Prune dead growth:</strong> Remove winter damage</li>
                  <li><strong>Check for pests:</strong> After winter dormancy</li>
                </ul>
              </div>
              
              <div className="content-card">
                <h3>☀️ Summer (June-August)</h3>
                <ul>
                  <li><strong>Regular watering:</strong> Check daily in heat</li>
                  <li><strong>Fertilize monthly:</strong> During active growth</li>
                  <li><strong>Watch for pests:</strong> Spider mites, mealybugs</li>
                  <li><strong>Provide shade:</strong> Protect from intense sun</li>
                  <li><strong>Increase humidity:</strong> Use misting or humidifier</li>
                  <li><strong>Rotate plants:</strong> For even light exposure</li>
                </ul>
              </div>
              
              <div className="content-card">
                <h3>🍁 Fall (September-November)</h3>
                <ul>
                  <li><strong>Reduce watering:</strong> As growth slows</li>
                  <li><strong>Stop fertilizing:</strong> By end of September</li>
                  <li><strong>Bring indoors:</strong> Before first frost</li>
                  <li><strong>Clean leaves:</strong> Remove dust buildup</li>
                  <li><strong>Check for pests:</strong> Before bringing inside</li>
                  <li><strong>Reduce light:</strong> As days get shorter</li>
                </ul>
              </div>
              
              <div className="content-card">
                <h3>❄️ Winter (December-February)</h3>
                <ul>
                  <li><strong>Minimal watering:</strong> Only when soil is dry</li>
                  <li><strong>No fertilizer:</strong> Plants are dormant</li>
                  <li><strong>Increase humidity:</strong> Use humidifier or pebble tray</li>
                  <li><strong>Watch temperature:</strong> Keep away from cold drafts</li>
                  <li><strong>Reduce light needs:</strong> Plants grow slower</li>
                  <li><strong>Group plants:</strong> For better humidity</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Problem Solving Section */}
          <section className="magazine-section">
            <div className="section-header">
              <div className="section-icon">🔍</div>
              <h2>Problem Solving</h2>
            </div>
            
            <div className="content-grid">
              <div className="content-card">
                <h3>🍂 Yellow Leaves</h3>
                <ul>
                  <li><strong>Overwatering:</strong> Reduce frequency, check drainage</li>
                  <li><strong>Underwatering:</strong> Increase watering schedule</li>
                  <li><strong>Nutrient deficiency:</strong> Apply balanced fertilizer</li>
                  <li><strong>Natural shedding:</strong> Old leaves fall off naturally</li>
                  <li><strong>Light issues:</strong> Too much or too little light</li>
                  <li><strong>Temperature stress:</strong> Check for drafts or heat</li>
                </ul>
              </div>
              
              <div className="content-card">
                <h3>🌱 Leggy Growth</h3>
                <ul>
                  <li><strong>Insufficient light:</strong> Move to brighter location</li>
                  <li><strong>Over-fertilizing:</strong> Reduce fertilizer frequency</li>
                  <li><strong>Prune regularly:</strong> Encourage bushier growth</li>
                  <li><strong>Rotate plant:</strong> For even light exposure</li>
                  <li><strong>Check spacing:</strong> Plants too close together</li>
                  <li><strong>Consider grow lights:</strong> For low-light areas</li>
                </ul>
              </div>
              
              <div className="content-card">
                <h3>🐛 Common Pests</h3>
                <ul>
                  <li><strong>Spider mites:</strong> Wipe with soapy water</li>
                  <li><strong>Mealybugs:</strong> Remove with cotton swab + alcohol</li>
                  <li><strong>Scale:</strong> Scrape off, treat with neem oil</li>
                  <li><strong>Fungus gnats:</strong> Let soil dry, use sticky traps</li>
                  <li><strong>Aphids:</strong> Spray with water or insecticidal soap</li>
                  <li><strong>Prevention:</strong> Regular inspection and cleaning</li>
                </ul>
              </div>
              
              <div className="content-card">
                <h3>💧 Root Rot</h3>
                <ul>
                  <li><strong>Signs:</strong> Wilting, yellow leaves, mushy roots</li>
                  <li><strong>Cause:</strong> Overwatering, poor drainage</li>
                  <li><strong>Treatment:</strong> Remove affected roots, repot</li>
                  <li><strong>Prevention:</strong> Use well-draining soil, proper pots</li>
                  <li><strong>Check drainage:</strong> Ensure pot has holes</li>
                  <li><strong>Water schedule:</strong> Only when soil is dry</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default MagazinePage;
