import { COMMITMENT_TYPES } from "../constants/commitmentTypes";


export function LegendsCard() {
    return (
        <div className="flex flex-wrap gap-3 my-6">
            {COMMITMENT_TYPES.map((type) => (
                <div
                    key={type.value}
                    className="flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-white shadow-sm"
                >
                    <span className={`w-2.5 h-2.5 rounded-full ${type.colors.solid}`} />
                    <span className="text-sm font-medium text-gray-700">
                        {type.label}
                    </span>
                </div>
            ))}
        </div>
    )
}