import { trigger, state, style, transition, animate } from '@angular/core';




export const slideIn = trigger(
      'slideIn',
      [
      transition(
        ':enter', [
          style({transform: 'translateX(-100%)', opacity: 0}),
          animate('200ms 205ms', style({transform: 'translateX(0)', 'opacity': 1}))
        ]
      )    
      ]
    );

export const slideOut = trigger(
      'slideOut',
      [
      transition(
        ':leave', [
          style({transform: 'translateX(0%)', opacity: 1}),
          animate('200ms 205ms', style({transform: 'translateX(100%)', 'opacity': 0}))
        ]
      )    
      ]
    );

export const shrinkOut =
    trigger(
      'shrinkOut',
      [
      transition(
        ':leave', [
          style({transform: 'translateX(0) scale(1)', opacity: 1}),
          animate('200ms', style({transform: 'translateX(0) scale(0)', 'opacity': 0}))
        ]
      ),    
      ] 
    );