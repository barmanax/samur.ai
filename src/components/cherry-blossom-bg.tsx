"use client";

import React from "react";

export function CherryBlossomBg() {
    return (
        <>
            <div id="leaves-container">
                {[...Array(15)].map((_, i) => (
                    <div className="leaf" key={i}>
                        <div className="petal"></div>
                    </div>
                ))}
            </div>
            <div className="tree-container">
                <svg viewBox="0 0 1000 1000" preserveAspectRatio="xMaxYMax slice" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <g id="flower">
                            <circle cx="0" cy="-14" r="11" fill="#f5789a" />
                            <circle cx="-13" cy="-4" r="11" fill="#f5789a" />
                            <circle cx="13" cy="-4" r="11" fill="#f5789a" />
                            <circle cx="-8" cy="12" r="11" fill="#f5789a" />
                            <circle cx="8" cy="12" r="11" fill="#f5789a" />
                            <circle cx="0" cy="0" r="4" fill="#000" />
                        </g>

                        <g id="flower-plain">
                            <circle cx="0" cy="-14" r="11" fill="#f5789a" />
                            <circle cx="-13" cy="-4" r="11" fill="#f5789a" />
                            <circle cx="13" cy="-4" r="11" fill="#f5789a" />
                            <circle cx="-8" cy="12" r="11" fill="#f5789a" />
                            <circle cx="8" cy="12" r="11" fill="#f5789a" />
                        </g>

                        <path id="svg-petal" d="M0,0 C-8,-8 -8,-16 0,-20 C8,-16 8,-8 0,0" fill="#f5789a" />
                    </defs>

                    <g fill="#0c0c0c">
                        <path d="M650,1000 L600,850 L610,800 L560,650 L580,620 L500,500 L520,490 L590,600 L650,780 L680,1000 Z" />
                        <path d="M570,640 L500,580 L420,590 L350,500 L370,490 L450,560 L520,550 L585,610 Z" />
                        <path d="M430,570 L380,450 L310,400 L320,380 L390,440 L450,550 Z" />
                        <path d="M350,500 L280,480 L220,400 L230,380 L300,460 L360,480 Z" />
                        <path d="M390,440 L350,350 L370,360 L400,430 Z" />
                        <path d="M310,400 L250,320 L270,330 L320,390 Z" />
                        <path d="M610,800 L700,720 L750,600 L820,480 L800,470 L730,590 L680,700 L595,760 Z" />
                        <path d="M740,600 L820,550 L880,450 L860,440 L800,530 L720,580 Z" />
                        <path d="M700,720 L780,680 L840,650 L830,630 L760,660 Z" />
                        <path d="M820,550 L880,580 L870,590 L810,560 Z" />
                        <path d="M880,450 L950,400 L940,390 L875,440 Z" />
                        <path d="M500,500 L450,400 L460,300 L480,310 L470,410 L515,490 Z" />
                        <path d="M460,300 L420,220 L440,230 L470,310 Z" />
                        <path d="M450,400 L520,320 L510,310 L445,390 Z" />
                        <path d="M520,320 L560,250 L580,260 L530,330 Z" />
                    </g>

                    <use href="#flower" transform="translate(220, 400) scale(1.1) rotate(20)" />
                    <use href="#flower-plain" transform="translate(280, 480) scale(0.9) rotate(-15)" />
                    <use href="#flower" transform="translate(350, 350) scale(1.3) rotate(45)" />
                    <use href="#flower-plain" transform="translate(310, 400) scale(0.8)" />
                    <use href="#flower" transform="translate(250, 320) scale(1) rotate(-30)" />
                    <use href="#svg-petal" transform="translate(180, 380) scale(1.2) rotate(60)" />
                    <use href="#svg-petal" transform="translate(200, 440) scale(0.9) rotate(110)" />

                    <use href="#flower" transform="translate(420, 220) scale(1.4) rotate(10)" />
                    <use href="#flower-plain" transform="translate(470, 310) scale(1.1) rotate(80)" />
                    <use href="#flower" transform="translate(560, 250) scale(1.2) rotate(-20)" />
                    <use href="#flower-plain" transform="translate(520, 320) scale(0.9)" />
                    <use href="#flower" transform="translate(450, 400) scale(1.3) rotate(35)" />
                    <use href="#svg-petal" transform="translate(380, 250) scale(1.3) rotate(-45)" />
                    <use href="#svg-petal" transform="translate(500, 200) scale(1.1) rotate(15)" />

                    <use href="#flower" transform="translate(750, 600) scale(1.2) rotate(-10)" />
                    <use href="#flower-plain" transform="translate(820, 550) scale(1.3) rotate(40)" />
                    <use href="#flower" transform="translate(880, 450) scale(1.1) rotate(25)" />
                    <use href="#flower-plain" transform="translate(840, 650) scale(0.8) rotate(-50)" />
                    <use href="#flower" transform="translate(950, 400) scale(1.2) rotate(15)" />
                    <use href="#flower-plain" transform="translate(880, 580) scale(1)" />
                    <use href="#svg-petal" transform="translate(920, 500) scale(1.2) rotate(80)" />
                    <use href="#svg-petal" transform="translate(790, 680) scale(0.9) rotate(30)" />

                    <use href="#flower-plain" transform="translate(580, 620) scale(0.8) rotate(10)" />
                    <use href="#svg-petal" transform="translate(680, 500) scale(1.5) rotate(-20)" />
                    <use href="#svg-petal" transform="translate(450, 620) scale(1.1) rotate(45)" />
                </svg>
            </div>
        </>
    );
}
