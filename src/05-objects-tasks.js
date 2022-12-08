/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() {
      return width * height;
    },
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return Object.setPrototypeOf(JSON.parse(json), proto);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class Builder {
  constructor() {
    this.selectorMap = {
      tag: '',
      id: '',
      classes: [],
      attributes: [],
      pseudoClasses: [],
      pseudoElement: '',
    };

    this.logger = {
      tagCount: 0,
      idCount: 0,
      classesCount: 0,
      attributesCount: 0,
      pseudoClassesCount: 0,
      pseudoElementCount: 0,
    };
  }

  element(value) {
    if (this.isApplicable('element')) {
      this.selectorMap.tag = `${value}`;
    }

    return this;
  }

  id(value) {
    if (this.isApplicable('id')) {
      this.selectorMap.id = `#${value}`;
    }

    return this;
  }

  class(value) {
    if (this.isApplicable('class')) {
      this.selectorMap.classes.push(`.${value}`);
    }

    return this;
  }

  attr(value) {
    if (this.isApplicable('attr')) {
      this.selectorMap.attributes.push(`[${value}]`);
    }

    return this;
  }

  pseudoClass(value) {
    if (this.isApplicable('pseudo-class')) {
      this.selectorMap.pseudoClasses.push(`:${value}`);
    }

    return this;
  }

  pseudoElement(value) {
    if (this.isApplicable('pseudo-element')) {
      this.selectorMap.pseudoElement = `::${value}`;
    }

    return this;
  }

  stringify() {
    return Object.values(this.selectorMap).flat().join('');
  }

  isApplicable(calledMethod) {
    if (calledMethod === 'element') {
      if (this.logger.tagCount) {
        throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
      }
      if (Object.values(this.logger).reduce((prev, curr) => prev + curr, 0)) {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }

      this.logger.tagCount += 1;
      return true;
    }

    if (calledMethod === 'id') {
      if (this.logger.idCount) {
        throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
      }
      if ([...Object.values(this.logger).slice(1)].reduce((prev, curr) => prev + curr, 0)) {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }

      this.logger.idCount += 1;
      return true;
    }

    if (calledMethod === 'class') {
      if ([...Object.values(this.logger).slice(3)].reduce((prev, curr) => prev + curr, 0)) {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }

      this.logger.classesCount += 1;
      return true;
    }

    if (calledMethod === 'attr') {
      if ([...Object.values(this.logger).slice(4)].reduce((prev, curr) => prev + curr, 0)) {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }

      this.logger.attributesCount += 1;
      return true;
    }

    if (calledMethod === 'pseudo-class') {
      if ([...Object.values(this.logger).slice(5)].reduce((prev, curr) => prev + curr, 0)) {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }

      this.logger.pseudoClassesCount += 1;
      return true;
    }

    if (calledMethod === 'pseudo-element') {
      if (this.logger.pseudoElementCount) {
        throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
      }

      this.logger.pseudoElementCount += 1;
      return true;
    }

    return null;
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new Builder().element(value);
  },

  id(value) {
    return new Builder().id(value);
  },

  class(value) {
    return new Builder().class(value);
  },

  attr(value) {
    return new Builder().attr(value);
  },

  pseudoClass(value) {
    return new Builder().pseudoClass(value);
  },

  pseudoElement(value) {
    return new Builder().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return {
      selector1Str: selector1.stringify(),
      selector2Str: selector2.stringify(),
      combinator,

      stringify() {
        return `${this.selector1Str} ${this.combinator} ${this.selector2Str}`;
      },
    };
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
