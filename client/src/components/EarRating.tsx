import {useState} from 'react'
/*props is short for properties*/
interface EarRatingProps{
    rating: number
    
    /* This the pastel and rating is the colour.
    
    callback function - a function that you pass as an argument to another function.
    The receiving function then calls (or executes/invokes) the callback at a specific time.
    
    callback function prop that passes newly selected rating up to the parent component (EarRating)
    
    (rating: number) => void - defines what the function looks like. It expects one argument (a clicked number
    1 through 5) and returns nothing (void)
    */
    onRate?: (rating: number) => void

    /*readOnly - boolean prop used to disable user interaction. 
    ? - means it's an optional interface property. You don't have to provide it when using the component.
    */
    readOnly?: boolean
}

/*readOnly = false is a default value, meaning that if you don't pass readOnly,
the component assumes it's false and the user can click and rate.

{rating, onRate, readOnly = false} - Destructuring. Prevents having to write props.rating,
props.onRate etc. inside the function. The properties are treated as local variables.

EarRatingProps - type annotation (the objects being passed into the parameter must
follow the structure of the EarRatingProps interface)

*/
function EarRating({rating, onRate, readOnly = false}: EarRatingProps){
    const [hovered, setHovered] = useState<number>(0)

    const displayRating = hovered || rating

    return(
        <div style={{display: 'flex', gap: '4px', alignItems: 'center'}}>
            
            {/*.map() transforms an existing array into new one

            ear - variable placeholder/argument that accepts incoming data
           
            {} lets you drop standard JS values into html

            key - tracks each rating
           
           */}
            {[1,2,3,4,5].map((ear)=>(
                <span
                    key={ear}
                    {/*!readOnly - freezes user interaction due to the negation (!)
                    
                    !readOnly - checks that the component is interactive, 
                    
                    onRate- checks if the parent (EarRating) actually provided an onRate function 
                    (preventing a crash if it was left out)

                    onRate(ear) - fires the function and sends the specific number of ear (e.g. 4)
                    back to the parent (EarRating)
                    
                    */}
                    onClick={() => !readOnly && onRate && onRate(ear)}
                     {/*!readOnly - prevents hovering effects, the ears won't light up or dim*/}
                    onMouseEnter={() => !readOnly && setHovered(ear)}
                    onMouseLeave={() => !readOnly && setHovered(0)}
                    style={{

                        fontSize: '1.4rem',
                         {/*!readOnly - changes the mouse cursor. Instead of showing a clickable 
                         pointer hand (pointer) it keeps the arrow (default) so the user knows 
                         it isn't interactive*/}
                        cursor: readOnly? 'default': 'pointer',


            /* summarize this:
            - Ternary operator (condition ? if_true : if_false) 
            - Dynamically changes the transparency of an individual ear based on the current rating.
It determines whether a specific ear should look "filled in" (active) or "faded out" (inactive).

The Breakdown

• ear <= displayRating: The condition being checked. It compares the numerical value of the current ear icon (e.g., the 4th ear in a 5-ear row) against the rating currently being displayed.
• 1 (Fully Opaque): If the ear's value is less than or equal to the rating, this value is chosen. The ear will be completely solid and bright because it falls within the given score.
• 0.25 (Semi-Transparent): If the ear's value is higher than the rating, this value is chosen. The ear will fade to 25% opacity, making it look empty or unselected.

Visual Example

If displayRating is 3, a loop will evaluate 5 ear icons:
• Ear 1: 1 <= 3 (True) → Opacity: 1 (Bright)
• Ear 2: 2 <= 3 (True) → Opacity: 1 (Bright)
• Ear 3: 3 <= 3 (True) → Opacity: 1 (Bright)
• Ear 4: 4 <= 3 (False) → Opacity: 0.25 (Faded)
• Ear 5: 5 <= 3 (False) → Opacity: 0.25 (Faded)
Would you like to see how this logic integrates into a hover state so the ears light up dynamically when a user moves their mouse over them?

            */
                        opacity: ear <= displayRating ? 1: 0.25,
                        transition: 'opacity 0.15s',
                        userSelect: 'none'

                    }}
                    
                    >
                        👂
                </span>
            ))}

             {/*!readOnly - Hides the numeric score text next to the ears once the rating is made*/}
            {!readOnly && (
                <span style = {{color: '#aaaaaa', fontSize: '0.85rem', marginLeft: '4px'}}>
                {hovered|| rating}/5
                </span>
            )}

        </div>
    )
}

export default EarRating
