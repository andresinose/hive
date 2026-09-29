import { useState } from "react";
import type { ComponentDef } from "@/types/a2ui";
import type { RenderCtx } from "../A2UIRenderer";
import { resolveDynamicNumber, resolveDynamicString } from "../dataBinding";
import { Slider } from "@/components/ui/slider";

export function A2UISlider({ def, ctx }: { def: ComponentDef; ctx: RenderCtx }) {
  // spec: "min"/"max" | ours: "minValue"/"maxValue" (aliases)
  const min = typeof def.min === "number" ? def.min : def.minValue ?? 0;
  const max = typeof def.max === "number" ? def.max : def.maxValue ?? 100;
  const step = typeof def.step === "number" ? def.step : 1;

  const rawLabel = def.label;
  const label = typeof rawLabel === "string" ? resolveDynamicString(rawLabel, ctx.dataModel, ctx.scopeData) : undefined;

  const initialValue = resolveDynamicNumber(def.value as any, ctx.dataModel, ctx.scopeData);
  const [localValue, setLocalValue] = useState(initialValue);

  const updateModel = (v: number) => {
    if (typeof def.value === "object" && def.value !== null && "path" in (def.value as any)) {
      const path = (def.value as any).path as string;
      ctx.setDataModel((prev) => {
        const next = structuredClone(prev);
        const parts = path.replace(/^\//, "").split("/");
        let cur: any = next;
        for (let i = 0; i < parts.length - 1; i++) {
          if (cur[parts[i]] == null) cur[parts[i]] = {};
          cur = cur[parts[i]];
        }
        cur[parts[parts.length - 1]] = v;
        return next;
      });
    }
  };

  const handleChange = (val: number[]) => {
    setLocalValue(val[0]);
    updateModel(val[0]);
  };

  const handleCommit = (val: number[]) => {
    const v = val[0];
    const action = def.action as any;
    const event = action?.event ?? action;
    const eventName = event?.name as string | undefined;
    if (eventName) {
      ctx.onAction(eventName, { value: v }, def.id);
    }
  };

  return (
    <div className="space-y-2 py-1.5 w-full" style={def.weight ? { flex: def.weight } : undefined}>
      <div className="flex items-center justify-between gap-2 text-xs">
        {label ? <span className="font-medium text-white/80 truncate">{label}</span> : <span />}
        <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/15 px-2 py-0.5 rounded border border-blue-500/30">
          {localValue}
        </span>
      </div>
      <Slider
        value={[localValue]}
        min={min}
        max={max}
        step={step}
        onValueChange={handleChange}
        onValueCommit={handleCommit}
        className="w-full py-1 cursor-pointer"
      />
      <div className="flex justify-between text-[10px] text-white/35 font-mono px-0.5">
        <span>min: {min}</span>
        <span>max: {max}</span>
      </div>
    </div>
  );
}
