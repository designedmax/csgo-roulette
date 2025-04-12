{\rtf1\ansi\ansicpg1251\cocoartf2821
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 document.querySelectorAll('.roulette-option').forEach(option => \{\
  option.addEventListener('click', () => \{\
    const chance = Math.random();\
    const result = document.getElementById('result');\
\
    if (chance < 0.4) \{\
      result.innerHTML = "\uc0\u1042 \u1099 \u1080 \u1075 \u1088 \u1099 \u1096 ! \u1057 \u1082 \u1080 \u1085  \u1080 \u1079  CS:GO!";\
    \} else \{\
      result.innerHTML = "\uc0\u1059 \u1074 \u1099 , \u1085 \u1077  \u1087 \u1086 \u1074 \u1077 \u1079 \u1083 \u1086 ! \u1055 \u1086 \u1087 \u1088 \u1086 \u1073 \u1091 \u1081  \u1089 \u1085 \u1086 \u1074 \u1072 .";\
    \}\
  \});\
\});}