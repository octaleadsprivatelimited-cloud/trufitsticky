import React from "react";
import ProgramBenefit from "./ProgramBenefit";
import Point from "../../assets/card-plan-desc.svg";

/**
 * ProgramDescriptionRenderer
 * --------------------------
 * Renders an admin-authored block document (see backend
 * admin_functions/program_content.py) for the public coach card. Data-driven and
 * SAFE: every text value is emitted as a React child (auto-escaped); there is no
 * dangerouslySetInnerHTML anywhere. Reuses the existing .card-plan-* classes so
 * the output matches the previously-hardcoded JSX.
 *
 * Block grammar:
 *   heading        { text }                     -> opens a new .card-plan-det section
 *   subheading     { text }                     -> bold sub-title within a section
 *   paragraph      { text, link? }              -> body text + optional trailing link
 *   bulleted_list  { style, icon|emoji|marker, items:[{title?, text?}] }
 *
 * Inline convention: **bold** runs inside paragraph/item text render as bold
 * spans (parsed here into React elements — never raw HTML).
 */

const ICON_ASSETS = { point: Point };
const LINK_STYLE = { color: "#9c27ff", textDecoration: "underline" };

// Defense-in-depth: the backend already allowlists link hrefs, but never emit a
// non-(internal | https) href — browsers execute javascript:/data: URIs in href.
function safeHref(href) {
  if (typeof href !== "string") return null;
  const h = href.trim();
  if (/^\/(?!\/)/.test(h) || /^https:\/\//i.test(h)) return h;
  return null;
}

// Split a string on **bold** markers into React nodes. Even segments are normal
// text, odd segments are bold. Unbalanced markers degrade gracefully (trailing
// text stays normal).
function renderInline(text) {
  if (typeof text !== "string" || text.length === 0) return null;
  if (text.indexOf("**") === -1) return text;
  const parts = text.split("**");
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="card-plan-desc-title" style={{ display: "inline" }}>
        {part}
      </span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

// Marker element for a bulleted-list item, by style.
function BulletMarker({ style, icon, emoji, marker, index, bulletIcon }) {
  const span = (content) => (
    <span
      aria-hidden="true"
      style={{
        minWidth: "12px",
        margin: "4px 0",
        fontSize: "12px",
        fontWeight: 600,
        lineHeight: "normal",
        color: "#000",
        flexShrink: 0,
      }}
    >
      {content}
    </span>
  );
  switch (style) {
    case "emoji":
      return emoji ? span(emoji) : span("•");
    case "ordered":
      return span(`${index + 1}.`);
    case "unordered":
      return span("•");
    case "other":
      return span(marker || "•");
    case "icon":
    default: {
      // No inline width — let the responsive `.card-plan-desc-sec img` CSS
      // (12px / 14px@768 / 20px@1440) size it exactly like the legacy markup.
      const src = ICON_ASSETS[icon] || bulletIcon || Point;
      return <img src={src} alt="" />;
    }
  }
}

function BulletItem({ item, listStyle, listIcon, listEmoji, listMarker, index, bulletIcon }) {
  const hasTitle = item && typeof item.title === "string" && item.title.length > 0;
  const hasText = item && typeof item.text === "string" && item.text.length > 0;
  if (!hasTitle && !hasText) return null;
  return (
    <div className="card-plan-desc-sec">
      <BulletMarker
        style={listStyle}
        icon={listIcon}
        emoji={listEmoji}
        marker={listMarker}
        index={index}
        bulletIcon={bulletIcon}
      />
      <div className="card-plan-desc">
        {hasTitle ? (
          <ProgramBenefit title={item.title}>
            {hasText && renderInline(item.text)}
          </ProgramBenefit>
        ) : (
          <span className="card-plan-desc-text">{renderInline(item.text)}</span>
        )}
      </div>
    </div>
  );
}

function Block({ block, bulletIcon }) {
  if (!block || typeof block !== "object") return null;
  switch (block.type) {
    case "heading":
      return <p className="card-plan-title">{block.text}</p>;
    case "subheading":
      return (
        <p className="card-plan-title" style={{ marginBottom: "8px" }}>
          {block.text}
        </p>
      );
    case "paragraph":
      return (
        <div className="card-plan-desc-sec">
          <div className="card-plan-desc">
            <span className="card-plan-desc-text">
              {renderInline(block.text)}
              {block.link && safeHref(block.link.href) && (
                <>
                  {" "}
                  <a href={safeHref(block.link.href)} style={LINK_STYLE}>
                    {block.link.label || block.link.href}
                  </a>
                </>
              )}
            </span>
          </div>
        </div>
      );
    case "bulleted_list": {
      const items = Array.isArray(block.items) ? block.items : [];
      return (
        <>
          {items.map((item, i) => (
            <BulletItem
              key={item && item.id ? item.id : i}
              item={item}
              index={i}
              listStyle={block.style}
              listIcon={block.icon}
              listEmoji={block.emoji}
              listMarker={block.marker}
              bulletIcon={bulletIcon}
            />
          ))}
        </>
      );
    }
    default:
      // Unknown/forward-compatible block type — skip, never throw.
      if (import.meta && import.meta.env && import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.warn("[ProgramDescriptionRenderer] unknown block type:", block.type);
      }
      return null;
  }
}

/**
 * Group blocks into sections. A `heading` (or any block flagged `new_section`)
 * starts a new .card-plan-det section; any blocks before the first such block
 * form an implicit leading section. This reproduces the original multi-section
 * layout (each section = one .card-plan-det with its 20px top margin and 15px
 * internal gap), including a standalone trailing "Terms" paragraph.
 */
function groupIntoSections(blocks) {
  const sections = [];
  let current = null;
  blocks.forEach((block) => {
    if (block && (block.type === "heading" || block.new_section === true)) {
      current = [block];
      sections.push(current);
    } else {
      if (!current) {
        current = [];
        sections.push(current);
      }
      current.push(block);
    }
  });
  return sections;
}

export default function ProgramDescriptionRenderer({ blocks, bulletIcon = Point }) {
  if (!Array.isArray(blocks) || blocks.length === 0) return null;
  const sections = groupIntoSections(blocks);
  return (
    <>
      {sections.map((sectionBlocks, si) => (
        <div className="card-plan-det" key={si}>
          {sectionBlocks.map((block, bi) => (
            <Block key={block && block.id ? block.id : bi} block={block} bulletIcon={bulletIcon} />
          ))}
        </div>
      ))}
    </>
  );
}
