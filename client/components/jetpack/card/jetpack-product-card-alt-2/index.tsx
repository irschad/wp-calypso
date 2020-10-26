/**
 * External dependencies
 */
import classNames from 'classnames';
import { useTranslate, TranslateResult } from 'i18n-calypso';
import { isFinite, isNumber } from 'lodash';
import React, { createElement, ReactNode, FunctionComponent } from 'react';

/**
 * Internal dependencies
 */
import { Button, ProductIcon } from '@automattic/components';
import InfoPopover from 'calypso/components/info-popover';
import { useLocalizedMoment } from 'calypso/components/localized-moment';
import { preventWidows } from 'calypso/lib/formatting';
import PlanPrice from 'calypso/my-sites/plan-price';
import PlanPriceFree from 'calypso/my-sites/plan-price-free';
import JetpackProductCardFeatures, { Props as FeaturesProps } from './features';

/**
 * Type dependencies
 */
import type { Moment } from 'moment';

/**
 * Style dependencies
 */
import './style.scss';
import ribbonSvg from './assets/ribbon.svg';

type OwnProps = {
	className?: string;
	iconSlug: string;
	productName: TranslateResult;
	productType?: string;
	headingLevel?: number;
	subheadline?: TranslateResult;
	description?: ReactNode;
	currencyCode: string | null;
	originalPrice: number;
	discountedPrice?: number;
	billingTimeFrame: TranslateResult;
	buttonLabel: TranslateResult;
	buttonPrimary: boolean;
	onButtonClick: () => void;
	searchRecordsDetails?: ReactNode;
	isHighlighted?: boolean;
	isOwned?: boolean;
	isDeprecated?: boolean;
	expiryDate?: Moment;
	isFree?: boolean;
};

export type Props = OwnProps & Partial< FeaturesProps >;

const JetpackProductCardAlt2: FunctionComponent< Props > = ( {
	className,
	iconSlug,
	productName,
	productType,
	headingLevel,
	subheadline,
	description,
	currencyCode,
	originalPrice,
	discountedPrice,
	billingTimeFrame,
	buttonLabel,
	buttonPrimary,
	onButtonClick,
	searchRecordsDetails,
	isHighlighted,
	isOwned,
	isDeprecated,
	expiryDate,
	features,
	isExpanded,
	isFree,
	productSlug,
}: Props ) => {
	const translate = useTranslate();
	const moment = useLocalizedMoment();

	const isDiscounted = isFinite( discountedPrice );
	const parsedHeadingLevel = isNumber( headingLevel )
		? Math.min( Math.max( Math.floor( headingLevel ), 1 ), 6 )
		: 2;
	const parsedExpiryDate =
		moment.isMoment( expiryDate ) && expiryDate.isValid() ? expiryDate : null;

	const renderBillingTimeFrame = (
		productExpiryDate: Moment | null,
		billingTerm: TranslateResult
	) => {
		return productExpiryDate ? (
			<time
				className="jetpack-product-card-alt-2__expiration-date"
				dateTime={ productExpiryDate.format( 'YYYY-DD-YY' ) }
			>
				{ translate( 'expires %(date)s', {
					args: {
						date: productExpiryDate.format( 'L' ),
					},
				} ) }
			</time>
		) : (
			<span className="jetpack-product-card-alt-2__billing-time-frame">{ billingTerm }</span>
		);
	};

	const buttonElt = (
		<Button
			primary={ buttonPrimary }
			className="jetpack-product-card-alt-2__button"
			onClick={ onButtonClick }
		>
			{ buttonLabel }
		</Button>
	);

	return (
		<div
			className={ classNames( className, 'jetpack-product-card-alt-2', {
				'is-owned': isOwned,
				'is-deprecated': isDeprecated,
				'is-featured': isHighlighted,
			} ) }
			data-e2e-product-slug={ productSlug }
		>
			<div className="jetpack-product-card-alt-2__ribbon">
				<span className="jetpack-product-card-alt-2__ribbon-text">{ translate( 'Bundle' ) }</span>
				<img className="jetpack-product-card-alt-2__ribbon-img" src={ ribbonSvg } alt="" />
			</div>
			<div className="jetpack-product-card-alt-2__summary">
				<header className="jetpack-product-card-alt-2__header">
					<ProductIcon className="jetpack-product-card-alt-2__icon" slug={ iconSlug } />
					{ createElement(
						`h${ parsedHeadingLevel }`,
						{ className: 'jetpack-product-card-alt-2__product-name' },
						<>
							{ preventWidows( productName ) }
							{ productType && (
								<span className="jetpack-product-card-alt-2__product-type">
									{ ' ' }
									{ preventWidows( productType ) }
								</span>
							) }
						</>
					) }

					{ subheadline && (
						<p className="jetpack-product-card-alt-2__subheadline">
							{ preventWidows( subheadline ) }
						</p>
					) }

					{ isFree ? (
						<PlanPriceFree productSlug={ productSlug } />
					) : (
						<div className="jetpack-product-card-alt-2__price">
							{ currencyCode && originalPrice ? (
								<>
									<span className="jetpack-product-card-alt-2__raw-price">
										<PlanPrice
											rawPrice={ isDiscounted ? discountedPrice : originalPrice }
											discounted
											currencyCode={ currencyCode }
										/>
										{ searchRecordsDetails && (
											<InfoPopover
												className="jetpack-product-card-alt-2__search-price-popover"
												position="right"
												iconSize={ 24 }
											>
												{ searchRecordsDetails }
											</InfoPopover>
										) }
									</span>

									{ renderBillingTimeFrame( parsedExpiryDate, billingTimeFrame ) }
								</>
							) : (
								<>
									<div className="jetpack-product-card-alt-2__price-placeholder" />
									<div className="jetpack-product-card-alt-2__time-frame-placeholder" />
								</>
							) }
						</div>
					) }
				</header>
				<div className="jetpack-product-card-alt-2__body">
					{ buttonElt }
					{ description && (
						<p className="jetpack-product-card-alt-2__description">{ description }</p>
					) }
				</div>
			</div>
			{ features && features.items.length > 0 && (
				<JetpackProductCardFeatures
					features={ features }
					productSlug={ productSlug }
					isExpanded={ isExpanded }
					ctaElt={ buttonElt }
				/>
			) }
		</div>
	);
};

export default JetpackProductCardAlt2;
