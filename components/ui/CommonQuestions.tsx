import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  

const Common = [
    {index:'1',question:"What is the difference between private use and business purposes?",answer:"Business Purpose enables you to use a firearm for security purposes but private is for your own defense."},
    {index:'2',question:"Is the range fee separate?", answer:"No, it is included, however additional ammunition is not free"},
    {index:'3',question: "How long do courses take?", answer:"Each Firearm or PSIRA course is 1-2 weeks long, Control Room and SASSETA upto 3 months"},
]


export default function CommonQuestions() {
    
    return (
        <div className="w-full">
            <Accordion type="single" collapsible className="w-full items-center">

                {Common.map((common) => (
                    <AccordionItem value={common.question} key={common.index}>
                        <AccordionTrigger className="w-full text-left"><p>{common.question}</p></AccordionTrigger>
                            <AccordionContent>
                            <p className="">{common.answer}</p>
                            </AccordionContent>
                    </AccordionItem>
                ))}
                
            </Accordion>

        </div>
    )
}