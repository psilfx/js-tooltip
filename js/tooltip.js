/**
 ** @desc Всплывающая подсказка для поля инпут с возможностью вставки варианта ответа
 **/
class InputTooltip {
	input;        //Сам инпут
	tooltip;      //Объект с вариантами заполнения
	tooltipItems; //Варианты заполнения, подгружаются из объекта tooltip по классу tooltip-item
	currentIndex; //Выбранный на данный момент вариант item
	/**
	 ** @desc Конструктор класса принимает инпут поле и блок с подсказками
	 ** @vars (htmlElement) input - сам инпут , (htmlElement) tooltip - блок с вариантами заполнения
	 **/
	constructor( input , tooltip ) {
		this.input        = input;
		this.tooltip      = tooltip;
		this.tooltipItems = this.tooltip.querySelectorAll('.tooltip-item');
		this.ApplyEvents();
		this.ApplyTooltipStyles();
	}
	/**
	 ** @desc Заполняет необходимые стили объектов подсказки. (по моей логике при сторонних скриптах css должно быть как можно меньше или не быть вообще)
	 **/
	ApplyTooltipStyles() {
		this.tooltip.style.display      = 'none';
		this.tooltip.style.position     = 'absolute';
		this.tooltip.style.background   = 'white';
		this.tooltip.style.border       = '1px solid #ccc';
		this.tooltip.style.borderRadius = '4px';
		this.tooltip.style.boxShadow    = '0 2px 5px rgba(0, 0, 0, 0.2)';
		this.tooltip.style.zIndex       = '100';
		this.tooltip.style.width        = '200px';
		this.tooltip.style.maxHeight    = '150px';
		this.tooltip.style.overflowY    = 'auto';
		this.tooltip.style.marginTop    = '5px';
		//Элементы списка
		this.tooltipItems.forEach( ( item , index ) => {
			item.style.padding = '8px 12px';
			item.style.cursor  = 'pointer';
		});
	}
	/**
	 ** @desc Добавляет прослушивания необходимых событий к элементам
	 **/
	ApplyEvents() {
		//Открытие вариантов при фокусе
		this.input.addEventListener( 'focus' , () => {
			this.tooltip.style.display = 'block';
			this.currentIndex          = -1;
			this.UpdateHighlight();
		});
		//Скрывает список вариантов при клике вне инпута
		document.addEventListener( 'click', ( e ) => {
			if ( e.target !== this.input && !this.tooltip.contains( e.target ) ) {
				this.tooltip.style.display = 'none';
				this.currentIndex          = -1;
			}
		});
		//Заполняет значение инпут при клике по какому то варианту
		this.tooltipItems.forEach( ( item , index ) => {
			item.addEventListener( 'click' , () => {
				this.SelectItem( index );
			});
		});
		//Нажатие клавиш
		this.input.addEventListener( 'keydown' , ( e ) => {
			if ( this.tooltip.style.display !== 'block' ) return;
			switch ( e.key ) {
				case 'ArrowDown':
					e.preventDefault();
					this.currentIndex = ( this.currentIndex + 1 ) % this.tooltipItems.length;
					this.UpdateHighlight();
					break;
				case 'ArrowUp':
					e.preventDefault();
					this.currentIndex = ( this.currentIndex - 1 + this.tooltipItems.length ) % this.tooltipItems.length;
					this.UpdateHighlight();
					break;
				case 'Enter':
					e.preventDefault();
					if ( this.currentIndex >= 0 ) this.SelectItem( this.currentIndex );
					break;
				case 'Escape':
					this.tooltip.style.display = 'none';
					this.currentIndex          = -1;
					break;
			}
		});
		//Фильтр вариантов при заполнении input
		this.input.addEventListener( 'input' , () => {
			let searchText    = this.input.value.toLowerCase();
			this.tooltipItems.forEach( item => {
				let text           = item.textContent.toLowerCase();
				item.style.display = text.includes( searchText ) ? 'block' : 'none';
			});
			this.currentIndex = -1;
		});
	}
	/**
	 ** @desc Подсвечивает выбранный вариант
	 **/
	UpdateHighlight() {
		this.tooltipItems.forEach( ( item , index ) => {
			item.classList.toggle( 'highlighted' , index === this.currentIndex );
			if ( index === this.currentIndex ) item.scrollIntoView( { block: 'nearest' } );
		});
	}
	/**
	 ** @desc Выделяет выбранный вариант
	 **/
	SelectItem( index ) {
		this.input.value           = this.tooltipItems[ index ].textContent;
		this.tooltip.style.display = 'none';
		this.currentIndex          = -1;
		this.input.focus(); //Возвращаем фокус в input
	}
}