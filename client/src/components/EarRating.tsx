import {useState} from 'react'

interface EarRatingProps{
    rating: number
    onRate?: (rating: number) => void
    readOnly?: boolean
}

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
                    onClick={() => !readOnly && onRate && onRate(ear)}
                    onMouseEnter={() => !readOnly && setHovered(ear)}
                    onMouseLeave={() => !readOnly && setHovered(0)}
                    style={{

                        fontSize: '1.4rem',
                        cursor: readOnly? 'default': 'pointer',
                        opacity: ear <= displayRating ? 1: 0.25,
                        transition: 'opacity 0.15s',
                        userSelect: 'none'

                    }}
                    
                    >
                        👂
                </span>
            ))}

            {!readOnly && (
                <span style = {{color: '#aaaaaa', fontSize: '0.85rem', marginLeft: '4px'}}>
                {hovered|| rating}/5
                </span>
            )}

        </div>
    )
}

export default EarRating