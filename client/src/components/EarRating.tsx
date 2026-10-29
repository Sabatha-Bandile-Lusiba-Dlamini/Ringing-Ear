import {useState} from 'react'

interface EarRatingProps{
    rating: number
    onRate?: (rating: number) => void

    /*readOnly - boolean prop used to disable user interaction. 
    ? - means it's optional. You don't have to provide it when using the component.
    */
    readOnly?: boolean
}

/*readOnly = false is a default value, meaning that if you don't pass readOnly,
the component assumes it's false and the user can click and rate.*/
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
                    {/*!readOnly - freezes user interaction due to the negation (!)*/}
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
