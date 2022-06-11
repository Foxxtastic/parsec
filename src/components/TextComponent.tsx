import { useEffect, useState } from "react"

type Line = {
    text: string,
    active: boolean
}

type TextComponentProps = {
    content: string | null
}

const getTextLines = (text: string): Line[] => {
    return text.split(/\r?\n/).map(_ => ({
        text: _,
        active: false
    })
    );
}

export function TextComponent({ content }: TextComponentProps) {
    const [Lines, setLines] = useState<Line[]>([]);

    useEffect(() => {
        content && setLines(getTextLines(content))
    }, [content])
    console.log(Lines)

    return (
        <>
            {Lines.length !== 0 &&
                <div className="text_content">
                    {Lines.map((_, idx) =>
                        <div key={idx} className="text_line">{_.text}</div>
                    )}
                </div>}
        </>
    )
}