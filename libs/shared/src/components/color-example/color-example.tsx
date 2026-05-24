import React from 'react';
import { COLORS } from '../../types/colors';

interface ColorExampleProps {
  className?: string;
}

export const ColorExample: React.FC<ColorExampleProps> = ({ className }) => {
  return (
    <div className={`p-6 space-y-4 ${className}`}>
      <h2 className="text-2xl font-bold text-basic-black">
        Color Palette Examples
      </h2>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-basic-black">Basic Colors</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col items-center">
            <div
              className="w-16 h-16 rounded-lg border-2 border-basic-black"
              style={{ backgroundColor: COLORS.basic.black }}
            />
            <span className="text-sm mt-2 text-basic-black">Basic Black</span>
            <span className="text-xs text-basic-black">
              {COLORS.basic.black}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <div
              className="w-16 h-16 rounded-lg border-2 border-basic-black"
              style={{ backgroundColor: COLORS.basic.white }}
            />
            <span className="text-sm mt-2 text-basic-black">Basic White</span>
            <span className="text-xs text-basic-black">
              {COLORS.basic.white}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <div
              className="w-16 h-16 rounded-lg border-2 border-basic-black"
              style={{ backgroundColor: COLORS.basic.green }}
            />
            <span className="text-sm mt-2 text-basic-black">Basic Green</span>
            <span className="text-xs text-basic-black">
              {COLORS.basic.green}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <div
              className="w-16 h-16 rounded-lg border-2 border-basic-black"
              style={{ backgroundColor: COLORS.basic.red }}
            />
            <span className="text-sm mt-2 text-basic-black">Basic Red</span>
            <span className="text-xs text-basic-black">{COLORS.basic.red}</span>
          </div>
          <div className="flex flex-col items-center">
            <div
              className="w-16 h-16 rounded-lg border-2 border-basic-black"
              style={{ backgroundColor: COLORS.basic.yellow }}
            />
            <span className="text-sm mt-2 text-basic-black">Basic Yellow</span>
            <span className="text-xs text-basic-black">
              {COLORS.basic.yellow}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <div
              className="w-16 h-16 rounded-lg border-2 border-basic-black"
              style={{ backgroundColor: COLORS.basic.gray }}
            />
            <span className="text-sm mt-2 text-basic-black">Basic Gray</span>
            <span className="text-xs text-basic-black">
              {COLORS.basic.gray}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <div
              className="w-16 h-16 rounded-lg border-2 border-basic-black"
              style={{ backgroundColor: COLORS.basic.grayLight }}
            />
            <span className="text-sm mt-2 text-basic-black">
              Basic Gray Light
            </span>
            <span className="text-xs text-basic-black">
              {COLORS.basic.grayLight}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <div
              className="w-16 h-16 rounded-lg border-2 border-basic-black"
              style={{ backgroundColor: COLORS.basic.blue }}
            />
            <span className="text-sm mt-2 text-basic-black">Basic Blue</span>
            <span className="text-xs text-basic-black">
              {COLORS.basic.blue}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <div
              className="w-16 h-16 rounded-lg border-2 border-basic-black"
              style={{ backgroundColor: COLORS.basic.greenLight }}
            />
            <span className="text-sm mt-2 text-basic-black">
              Basic Green Light
            </span>
            <span className="text-xs text-basic-black">
              {COLORS.basic.greenLight}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <div
              className="w-16 h-16 rounded-lg border-2 border-basic-black"
              style={{ backgroundColor: COLORS.basic.greenDark }}
            />
            <span className="text-sm mt-2 text-basic-black">
              Basic Green Dark
            </span>
            <span className="text-xs text-basic-black">
              {COLORS.basic.greenDark}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4 mt-8">
        <h3 className="text-lg font-semibold text-basic-black">
          Usage Examples
        </h3>

        <div className="space-y-2">
          <h4 className="font-medium text-basic-black">Tailwind Classes:</h4>
          <div className="space-y-2">
            <div className="p-3 bg-basic-black text-basic-white rounded">
              bg-basic-black text-basic-white
            </div>
            <div className="p-3 bg-basic-green text-basic-white rounded">
              bg-basic-green text-basic-white
            </div>
            <div className="p-3 bg-basic-red text-basic-white rounded">
              bg-basic-red text-basic-white
            </div>
            <div className="p-3 bg-basic-yellow text-basic-black rounded">
              bg-basic-yellow text-basic-black
            </div>
            <div className="p-3 bg-basic-gray text-basic-white rounded">
              bg-basic-gray text-basic-white
            </div>
            <div className="p-3 bg-basic-gray-light text-basic-black rounded">
              bg-basic-gray-light text-basic-black
            </div>
            <div className="p-3 bg-basic-blue text-basic-white rounded">
              bg-basic-blue text-basic-white
            </div>
            <div className="p-3 bg-basic-green-light text-basic-black rounded">
              bg-basic-green-light text-basic-black
            </div>
            <div className="p-3 bg-basic-green-dark text-basic-white rounded">
              bg-basic-green-dark text-basic-white
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-basic-black">CSS Variables:</h4>
          <div className="space-y-2">
            <div
              className="p-3 rounded"
              style={{
                backgroundColor: 'var(--color-basic-green)',
                color: 'var(--color-basic-white)',
              }}
            >
              CSS Variables: var(--color-basic-green)
            </div>
            <div
              className="p-3 rounded"
              style={{
                backgroundColor: 'var(--color-basic-red)',
                color: 'var(--color-basic-white)',
              }}
            >
              CSS Variables: var(--color-basic-red)
            </div>
            <div
              className="p-3 rounded"
              style={{
                backgroundColor: 'var(--color-basic-yellow)',
                color: 'var(--color-basic-black)',
              }}
            >
              CSS Variables: var(--color-basic-yellow)
            </div>
            <div
              className="p-3 rounded"
              style={{
                backgroundColor: 'var(--color-basic-gray)',
                color: 'var(--color-basic-white)',
              }}
            >
              CSS Variables: var(--color-basic-gray)
            </div>
            <div
              className="p-3 rounded"
              style={{
                backgroundColor: 'var(--color-basic-blue)',
                color: 'var(--color-basic-white)',
              }}
            >
              CSS Variables: var(--color-basic-blue)
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-basic-black">
            TypeScript Constants:
          </h4>
          <div className="space-y-2">
            <div
              className="p-3 rounded"
              style={{
                backgroundColor: COLORS.basic.green,
                color: COLORS.basic.white,
              }}
            >
              TypeScript: COLORS.basic.green
            </div>
            <div
              className="p-3 rounded"
              style={{
                backgroundColor: COLORS.basic.red,
                color: COLORS.basic.white,
              }}
            >
              TypeScript: COLORS.basic.red
            </div>
            <div
              className="p-3 rounded"
              style={{
                backgroundColor: COLORS.basic.yellow,
                color: COLORS.basic.black,
              }}
            >
              TypeScript: COLORS.basic.yellow
            </div>
            <div
              className="p-3 rounded"
              style={{
                backgroundColor: COLORS.basic.gray,
                color: COLORS.basic.white,
              }}
            >
              TypeScript: COLORS.basic.gray
            </div>
            <div
              className="p-3 rounded"
              style={{
                backgroundColor: COLORS.basic.blue,
                color: COLORS.basic.white,
              }}
            >
              TypeScript: COLORS.basic.blue
            </div>
            <div
              className="p-3 rounded"
              style={{
                backgroundColor: COLORS.basic.greenLight,
                color: COLORS.basic.black,
              }}
            >
              TypeScript: COLORS.basic.greenLight
            </div>
            <div
              className="p-3 rounded"
              style={{
                backgroundColor: COLORS.basic.greenDark,
                color: COLORS.basic.white,
              }}
            >
              TypeScript: COLORS.basic.greenDark
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-basic-black">Button Examples:</h4>
          <div className="flex flex-wrap gap-4">
            <button className="px-4 py-2 bg-basic-green text-basic-white rounded">
              Primary Button
            </button>
            <button className="px-4 py-2 bg-basic-red text-basic-white rounded">
              Danger Button
            </button>
            <button className="px-4 py-2 bg-basic-yellow text-basic-black rounded">
              Warning Button
            </button>
            <button className="px-4 py-2 bg-basic-gray text-basic-white rounded">
              Secondary Button
            </button>
            <button className="px-4 py-2 bg-basic-blue text-basic-white rounded">
              Info Button
            </button>
            <button className="px-4 py-2 bg-basic-green-light text-basic-black rounded border border-basic-green">
              Light Green Button
            </button>
            <button className="px-4 py-2 bg-basic-green-dark text-basic-white rounded">
              Dark Green Button
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-basic-black">Text Color Examples:</h4>
          <div className="space-y-2">
            <p className="text-basic-black">Text Basic Black</p>
            <p className="text-basic-white bg-basic-black p-2 rounded">
              Text Basic White
            </p>
            <p className="text-basic-green">Text Basic Green</p>
            <p className="text-basic-red">Text Basic Red</p>
            <p className="text-basic-yellow">Text Basic Yellow</p>
            <p className="text-basic-gray">Text Basic Gray</p>
            <p className="text-basic-blue">Text Basic Blue</p>
          </div>
        </div>
      </div>
    </div>
  );
};
