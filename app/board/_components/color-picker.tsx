'use client';

import { Color } from '@/types/canvas';


interface ColorPickerProps {
    onChange: (color: Color) => void
}


export const ColorPicker = ({ onChange }: ColorPickerProps) => {
    return (
        <div className="flex flex-wrap gap-2 items-center max-w-[164px] pr-2 mr-2 border-r border-neutral-200">
            <ColorButton
                color={{
                    r: 243,
                    g: 82,
                    b: 35,
                }}
                onClick={onChange}
            />         
        </div>
    )
}

interface ColorButtonProps {
    color: Color
    onClick: (color: Color) => void
}

const ColorButton = ({ color, onClick }: ColorButtonProps) => {

    return (
        <button 
            className="w-8 h-8 items-center flex justify-center hover:opacity-75 transition"
            onClick={() => onClick(color)}
        >

        </button>
    )
}