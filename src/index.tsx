function render (element: HuactElement, root: HTMLElement) {
    root.innerHTML = '';
    root.appendChild(renderNode(element));
}

function renderDomNode (element: HuactElement) {
    let ele = document.createElement(element.tagName as string);
    element.props && Object.keys(element.props).map(key => {
        if (key == 'children') {
            return;
        }
        let prop = element.props[key];
        if (key == 'className') {
            key = 'class';
        }
        ele.setAttribute(key, prop);
    });
    if (element.props.children) {
        let childrens = element.props.children.map(item => {
            if (typeof item == "string") {
                return document.createTextNode(item);
            } else if (typeof item == 'object' && item.tagName) {
                return renderNode(item);
            }
        });
        childrens.map(item => {
            ele.appendChild(item);
        })
    }
    return ele;
}

function renderComponentNode (element: HuactElement) {
    let tagname = element.tagName as Component;
    // @ts-ignore
    let inst=new tagname()
    inst.props=element.props;
    let renderEle = inst.render();
    return renderNode(renderEle);
}

function renderNode (element: HuactElement) {
    if (typeof element.tagName == "string") {
        return renderDomNode(element);
    } else {
        return renderComponentNode(element);
    }
}

interface HuactElement {
    tagName: string | Component,
    props: { [key: string]: any ,children:HuactElement[]} | null,
}

function createElement (tagName, props, ...children): HuactElement {
    return {
        tagName,
        props:{...props,children},
    }
}


class Component {

    constructor (props) {
    }

    props: HuactElement['props'];
    state: object;

    render (): HuactElement {
        return null
    }

    setState () {

    }

    forceUpdate () {

    }

}

class First extends Component {
    constructor (props) {
        super(props);
    }

    render (): HuactElement {
        return <div>
            <Second></Second>

            im first11{this.props.haha}
        </div>
    }
}

class Second extends Component{
    render () {
        return (
            <div>
                second ~~~
            </div>
        );
    }
}
console.log('initial');
let text = 'text123'
render(
    <div>123123
        <div class={'123'}>
            {text}
        </div>
        <First haha={'hahahahah'}></First>
        <input type="text"/>
    </div>,
    document.getElementById('root')
)

