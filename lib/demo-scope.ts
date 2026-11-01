export const SCENARIO_IDS = ["personal", "couple", "club", "returning"] as const;
export type ScenarioId = typeof SCENARIO_IDS[number];
export function isScenarioId(value: unknown): value is ScenarioId { return typeof value === "string" && (SCENARIO_IDS as readonly string[]).includes(value); }
export function browserStorageKey(key:string){
 if(typeof document==="undefined")return key;
 const scope=document.cookie.split("; ").find(c=>c.startsWith("tt-scenario="))?.split("=")[1];
 return isScenarioId(scope)?`demo:${scope}:${document.cookie.split("; ").find(c=>c.startsWith(`tt-revision-${scope}=`))?.split("=")[1]??"0"}:${document.cookie.split("; ").find(c=>c.startsWith("tt-demo-revision="))?.split("=")[1]??"local"}:${key}`:key;
}
