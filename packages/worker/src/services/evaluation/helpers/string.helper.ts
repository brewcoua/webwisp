export default class StringHelper {
    static clean(str: string): string {
        if (str.startsWith("'") && str.endsWith("'")) {
            str = str.slice(1, -1)
        } else if (str.startsWith('"') && str.endsWith('"')) {
            str = str.slice(1, -1)
        }
        return str.toLowerCase().trim()
    }

    static exact_match(ref: string, pred: string | number): number {
        if (typeof pred === 'number') {
            pred = pred.toString()
        }
        return this.clean(ref) === this.clean(pred) ? 1.0 : 0.0
    }

    static must_include(ref: string, pred: string): number {
        const clean_ref = this.clean(ref),
            clean_pred = this.clean(pred)

        if (this.word_tokenize(clean_ref).length === 1) {
            const tok_pred = this.word_tokenize(clean_pred)
            return tok_pred.includes(clean_ref) ? 1.0 : 0.0
        }

        return clean_pred.includes(clean_ref) ? 1.0 : 0.0
    }

    static must_exclude(ref: string, pred: string): number {
        const clean_ref = this.clean(ref),
            clean_pred = this.clean(pred)

        if (this.word_tokenize(clean_ref).length === 1) {
            const tok_pred = this.word_tokenize(clean_pred)
            return tok_pred.includes(clean_ref) ? 0.0 : 1.0
        }

        return clean_pred.includes(clean_ref) ? 0.0 : 1.0
    }

    static fuzzy_match(ref: string, pred: string): number {
        return 1.0 // TODO: implement fuzzy matching with LLM
    }

    static word_tokenize(str: string): string[] {
        // similar to nltk.tokenize's word_tokenize
        return /\w+|[^\w\s]/g.exec(str) || []
    }
}
