// types/fuzzyset.d.ts
declare module "fuzzyset" {
  export default function FuzzySet(
    source?: string[],
    useLevenshtein?: boolean,
    gramSizeLower?: number,
    gramSizeUpper?: number
  ): FuzzySet.FuzzySetInstance;

  namespace FuzzySet {
    interface FuzzySetInstance {
      get(candidate: string): [number, string][] | null;

      get<DEFAULT>(
        candidate: string,
        def?: DEFAULT,
        minScore?: number
      ): [number, string][] | DEFAULT;

      add(value: string): false | undefined;

      length(): number;

      isEmpty(): boolean;

      values(): string[];
    }
  }
}
