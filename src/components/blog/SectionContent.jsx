import { sectionDocument } from '../../blog/richText.mjs';
import InlineBlogImage from './InlineBlogImage';
function ContentNode({node}) {
  const children=node.content?.map((child,i)=><ContentNode key={i} node={child}/>);
  if(node.type==='text')return (node.marks||[]).reduce((text,mark)=>mark.type==='bold'?<strong>{text}</strong>:<em>{text}</em>,node.text);
  if(node.type==='hardBreak')return <br/>;
  if(node.type==='paragraph')return <p>{children?.length?children:<br/>}</p>;
  if(node.type==='heading')return node.attrs.level===3?<h3>{children}</h3>:<h2>{children}</h2>;
  if(node.type==='bulletList')return <ul>{children}</ul>;
  if(node.type==='orderedList')return <ol start={node.attrs.start}>{children}</ol>;
  if(node.type==='listItem')return <li>{children}</li>;
  if(node.type==='blockquote')return <blockquote>{children}</blockquote>;
  if(node.type==='trufitImage')return <InlineBlogImage image={node.attrs.image} caption={node.attrs.caption}/>;
  return <>{children}</>;
}
export default function SectionContent({section}) {return <div className="journal-rich-content"><ContentNode node={sectionDocument(section)}/></div>;}
