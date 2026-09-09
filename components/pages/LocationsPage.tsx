"use client";

import { scrollToId } from "@/lib/scroll";
import { useCopy, useCopyList } from "@/components/SiteContentProvider";

export default function LocationsPage({ onWatchVideo }: { onWatchVideo: () => void }) {
  const copy = useCopy();
  const copyList = useCopyList();
  const southFultonFeatures = copyList("locations.features");
  const beltlineFeatures = copyList("locations.beltline.features");

  return (
    <div className="page" id="page-locations">
      <section className="band" style={{ paddingTop: 56 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">{copy("locations.eyebrow")}</span>
            <h2>{copy("locations.title")}</h2>
            <p>{copy("locations.body")}</p>
          </div>

          <div className="loc-card">
            <div className="loc-photo">
              <img
                src="/img/south-fulton.jpeg"
                alt="South Fulton location property"
              />
            </div>
            <div className="loc-body">
              <span className="loc-status">{copy("locations.status")}</span>
              <h3>{copy("locations.name")}</h3>
              <div className="loc-feats">
                {southFultonFeatures.map((feat) => (
                  <span className="loc-feat" key={feat}>
                    {feat}
                  </span>
                ))}
              </div>
              <div className="loc-actions">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => scrollToId("apply-options")}
                >
                  {copy("locations.apply_cta")}
                </button>
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={onWatchVideo}
                  style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{ width: 18, height: 18, color: "var(--gold)" }}
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  {copy("locations.video_cta")}
                </button>
              </div>
            </div>
          </div>

          <div className="loc-card">
            <div className="loc-photo">
              <img
                src="/img/atlanta-beltline.jpg"
                alt="Atlanta BeltLine Access location"
              />
            </div>
            <div className="loc-body">
              <span className="loc-status">{copy("locations.status")}</span>
              <h3>{copy("locations.beltline.name")}</h3>
              <div className="loc-feats">
                {beltlineFeatures.map((feat) => (
                  <span className="loc-feat" key={feat}>
                    {feat}
                  </span>
                ))}
              </div>
              <div className="loc-actions">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => scrollToId("apply-options")}
                >
                  {copy("locations.apply_cta")}
                </button>
              </div>
            </div>
          </div>

          <div className="expansion-note">
            <h4>{copy("locations.expansion_title")}</h4>
            <p>{copy("locations.expansion_body")}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
