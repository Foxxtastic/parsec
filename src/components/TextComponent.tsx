import { Checkbox } from "antd";
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
    const [lines, setLines] = useState<Line[]>([]);

    useEffect(() => {
        content && setLines(getTextLines(content))
    }, [content])
    console.log(lines);

    const toggleActiveLine = (index: number) => {
        setLines(lines.map((_, idx) => idx !== index ? _ :
            ({ text: _.text, active: !_.active })
        ));
    }

    return (
        <>
            {lines.length !== 0 &&
                <div className="text_content">
                    {lines.map((_, idx) =>
                        <div key={idx} className="text_line">
                            {_.text !== '' && <Checkbox
                                onChange={() => toggleActiveLine(idx)}>
                            </Checkbox>}
                            {_.text}
                        </div>
                    )}
                </div>}
        </>
    )
}