/**
 * Hand-drawn pinching hand, inked in black on white.
 * Local coordinate space is HAND_SIZE; HAND_TIP is where the fingers pinch the strings.
 */
export const HAND_SIZE = { w: 300, h: 264 } as const;
export const HAND_TIP = { x: 267, y: 75 } as const;

export function Hand() {
  return (
    <g className="hand-art" strokeLinecap="round" strokeLinejoin="round">
      {/* sleeve */}
      <path
        className="ink-fill ink"
        d="M -4 266 L -4 204 C 18 193, 40 182, 61 170 C 66 176, 70 182, 74 188 C 84 204, 94 220, 105 236 C 97 246, 92 256, 90 266"
      />
      <path className="ink ink--thin" d="M 50 176 C 64 196, 78 218, 90 242" />
      <path className="ink ink--hatch" d="M 8 222 l 20 -11 M 12 238 l 28 -16 M 20 254 l 32 -18 M 34 264 l 30 -17" />

      {/* curled middle finger, seen through the pinch */}
      <path
        className="ink-fill ink"
        d="M 186 112 C 200 102, 220 104, 226 118 C 231 131, 222 144, 206 144 C 196 144, 188 138, 184 130"
      />
      <path className="ink ink--thin" d="M 209 112 C 213 118, 214 126, 211 133" />

      {/* palm and back of the hand */}
      <path
        className="ink-fill ink"
        d="M 60 172 C 85 158, 110 140, 138 121 C 152 111, 164 103, 177 98 C 183 104, 188 109, 191 114 C 184 126, 178 138, 175 150 C 171 172, 152 192, 130 206 C 119 214, 109 226, 98 239 C 88 220, 74 194, 60 172 Z"
      />
      <path className="ink ink--thin" d="M 120 150 C 132 142, 146 132, 158 124" />

      {/* index finger, bent at the middle joint */}
      <path
        className="ink-fill ink"
        d="M 168 104 C 185 92, 200 79, 216 69 C 232 59, 249 51, 262 53 C 273 55, 274 69, 263 73 C 249 77, 233 83, 219 91 C 207 98, 197 106, 189 114 C 183 110, 176 106, 168 104 Z"
      />
      <path className="ink ink--thin" d="M 214 71 C 218 77, 220 83, 219 89" />
      <path className="ink ink--thin" d="M 257 55 C 264 55, 268 59, 267 65" />

      {/* thumb */}
      <path
        className="ink-fill ink"
        d="M 130 206 C 152 195, 181 172, 206 146 C 226 124, 243 101, 253 85 C 259 76, 271 78, 269 89 C 263 105, 249 125, 233 143 C 213 167, 187 190, 161 206 C 150 212, 139 213, 130 206 Z"
      />
      <path className="ink ink--thin" d="M 257 84 C 263 82, 267 86, 265 92" />
      <path className="ink ink--hatch" d="M 168 196 l 14 -13 M 180 194 l 16 -15 M 194 186 l 14 -13 M 150 204 l 10 -9" />
      <path className="ink ink--thin" d="M 176 150 C 172 162, 166 172, 156 182" />
    </g>
  );
}
