import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { VariationsSection } from "@/features/flags/sections/VariationsSection";
import { TargetingRulesSection } from "@/features/flags/sections/TargetingRulesSection";
import { IndividualTargetsSection } from "@/features/flags/sections/IndividualTargetsSection";
import { DefaultRuleSection } from "@/features/flags/sections/DefaultRuleSection";
import { PrerequisitesSection } from "@/features/flags/sections/PrerequisitesSection";
import type { Variation } from "@/types/launchdarkly";

const boolVariations: Variation[] = [
  { _id: "v0", value: false, name: "Off" },
  { _id: "v1", value: true, name: "On" },
];

const multiVariations: Variation[] = [
  { _id: "v0", value: "control", name: "Control" },
  { _id: "v1", value: "variant-a", name: "Variant A" },
  { _id: "v2", value: "variant-b", name: "Variant B" },
];

describe("VariationsSection", () => {
  it("renders boolean variations", () => {
    render(<VariationsSection variations={boolVariations} />);
    expect(screen.getByText("Variations")).toBeInTheDocument();
    expect(screen.getByText("false")).toBeInTheDocument();
    expect(screen.getByText("true")).toBeInTheDocument();
  });

  it("renders multivariate variations", () => {
    render(<VariationsSection variations={multiVariations} />);
    expect(screen.getByText('"control"')).toBeInTheDocument();
    expect(screen.getByText('"variant-a"')).toBeInTheDocument();
    expect(screen.getByText('"variant-b"')).toBeInTheDocument();
  });

  it("shows variation names", () => {
    render(<VariationsSection variations={boolVariations} />);
    expect(screen.getByText("Off")).toBeInTheDocument();
    expect(screen.getByText("On")).toBeInTheDocument();
  });
});

describe("TargetingRulesSection", () => {
  it("shows no rules message when empty", () => {
    render(<TargetingRulesSection rules={[]} variations={boolVariations} envName="Production" />);
    expect(screen.getByText("No targeting rules configured.")).toBeInTheDocument();
  });

  it("renders targeting rules with clauses", () => {
    render(
      <TargetingRulesSection
        rules={[
          {
            _id: "rule1",
            description: "Beta Users",
            clauses: [
              {
                attribute: "email",
                op: "endsWith",
                values: ["@example.com"],
                negate: false,
              },
            ],
            variation: 1,
          },
        ]}
        variations={boolVariations}
        envName="Production"
      />,
    );
    expect(screen.getByText("Beta Users")).toBeInTheDocument();
    expect(screen.getByText("Rule 1")).toBeInTheDocument();
  });

  it("renders percentage rollout", () => {
    render(
      <TargetingRulesSection
        rules={[
          {
            _id: "rule2",
            description: "Gradual Rollout",
            clauses: [
              { attribute: "country", op: "in", values: ["US"], negate: false },
            ],
            rollout: {
              variations: [
                { variation: 0, weight: 75000 },
                { variation: 1, weight: 25000 },
              ],
            },
          },
        ]}
        variations={boolVariations}
        envName="Staging"
      />,
    );
    expect(screen.getByText("Gradual Rollout")).toBeInTheDocument();
    expect(screen.getByText("(75.0%)")).toBeInTheDocument();
    expect(screen.getByText("(25.0%)")).toBeInTheDocument();
  });

  it("truncates long clause values", () => {
    render(
      <TargetingRulesSection
        rules={[
          {
            _id: "rule3",
            clauses: [
              {
                attribute: "email",
                op: "in",
                values: ["a@b.com", "c@d.com", "e@f.com", "g@h.com"],
                negate: false,
              },
            ],
            variation: 1,
          },
        ]}
        variations={boolVariations}
        envName="Dev"
      />,
    );
    expect(screen.getByText(/\+1 more/)).toBeInTheDocument();
  });
});

describe("IndividualTargetsSection", () => {
  it("renders nothing when no targets", () => {
    const { container } = render(
      <IndividualTargetsSection targets={[]} variations={boolVariations} envName="Production" />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders targets grouped by variation", () => {
    render(
      <IndividualTargetsSection
        targets={[
          { values: ["user-123", "user-456"], variation: 1 },
          { values: ["user-789"], variation: 0 },
        ]}
        variations={boolVariations}
        envName="Production"
      />,
    );
    expect(screen.getByText("user-123")).toBeInTheDocument();
    expect(screen.getByText("user-456")).toBeInTheDocument();
    expect(screen.getByText("user-789")).toBeInTheDocument();
  });
});

describe("DefaultRuleSection", () => {
  it("renders fallthrough with fixed variation", () => {
    render(
      <DefaultRuleSection
        fallthrough={{ variation: 0 }}
        offVariation={0}
        isOn={true}
        variations={boolVariations}
        envName="Production"
      />,
    );
    expect(screen.getByText(/When targeting is ON/)).toBeInTheDocument();
    expect(screen.getByText("ON")).toBeInTheDocument();
  });

  it("renders OFF status", () => {
    render(
      <DefaultRuleSection
        fallthrough={{ variation: 0 }}
        offVariation={0}
        isOn={false}
        variations={boolVariations}
        envName="Production"
      />,
    );
    expect(screen.getByText("OFF")).toBeInTheDocument();
  });

  it("renders percentage rollout fallthrough", () => {
    render(
      <DefaultRuleSection
        fallthrough={{
          rollout: {
            variations: [
              { variation: 0, weight: 50000 },
              { variation: 1, weight: 50000 },
            ],
          },
        }}
        offVariation={0}
        isOn={true}
        variations={boolVariations}
        envName="Production"
      />,
    );
    expect(screen.getAllByText("(50.0%)")).toHaveLength(2);
  });
});

describe("PrerequisitesSection", () => {
  it("renders nothing when no prerequisites", () => {
    const { container } = render(
      <PrerequisitesSection prerequisites={[]} variations={boolVariations} />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders prerequisite flags", () => {
    render(
      <PrerequisitesSection
        prerequisites={[{ key: "auth-v2", variation: 1 }]}
        variations={boolVariations}
      />,
    );
    expect(screen.getByText("auth-v2")).toBeInTheDocument();
    expect(screen.getByText("Prerequisites")).toBeInTheDocument();
  });
});
