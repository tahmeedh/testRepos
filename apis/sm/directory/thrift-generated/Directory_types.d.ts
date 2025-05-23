//
// Autogenerated by Thrift Compiler (0.16.0)
//
// DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
//
import thrift = require('thrift');
import Thrift = thrift.Thrift;
import Q = thrift.Q;
import Int64 = require('node-int64');


/**
 * Visibility of the profile attribute.
 * 
 * <dl>
 *   <dt>PUBLIC</dt><dd>Visible to all users.</dd>
 *   <dt>COMPANY</dt><dd>Only visible to users within the same company.</dd>
 * </dl>
 */
declare enum AttributeVisibility {
  PUBLIC = 1,
  COMPANY = 2,
}

/**
 * Editability of the profile attribute.
 * 
 * <dl>
 *   <dt>NONE</dt><dd>Attribute is not editable.</dd>
 *   <dt>TIGHT</dt><dd>Attribute is tightly coupled, i.e. updating the user account record will update the user profile attribute and vice-versa.</dd>
 *   <dt>LOOSE</dt><dd>Attribute is loosely coupled, i.e. the user account record and user profile attribute can be updated independently.</dd>
 * </dl>
 */
declare enum AttributeEditability {
  NONE = 1,
  TIGHT = 2,
  LOOSE = 3,
}

/**
 * Scope of a search
 * 
 * <dl>
 *   <dt>ALL</dt><dd>Search all users.</dd>
 *   <dt>PUBLIC</dt><dd>Search users with public directory entitlement.</dd>
 *   <dt>COMPANY</dt><dd>Search users with company directory entitlement.</dd>
 * </dl>
 */
declare enum SearchScope {
  ALL = 1,
  PUBLIC = 2,
  COMPANY = 3,
}

/**
 * Structure used for paging and sorting search results.
 * <dl>
 *  <dt>startIndex</dt><dd>The start index of the first element in page to retrieve (pageNumber * pageSize).</dd>
 *  <dt>pageSize</dt><dd>The size of the page to retrieve.</dd>
 *  <dt>sortProperty</dt><dd>The field on which to sort.</dd>
 *  <dt>sortDirection</dt><dd>The sort direction (asc or desc).</dd>
 * </dl>
 */
declare class PagingStruct {
  public startIndex?: number;
  public pageSize?: number;
  public sortProperty?: string;
  public sortDirection?: string;

    constructor(args?: { startIndex?: number; pageSize?: number; sortProperty?: string; sortDirection?: string; });
}

/**
 * Reports-To property, containing basic information about the user. Used for both ReportsTo and Direct Reports information.
 * 
 * <dl>
 *   <dt>userId</dt><dd>SM User ID of the user.</dd>
 *   <dt>firstName</dt><dd>First name of the user.</dd>
 *   <dt>lastName</dt><dd>Last name of the user.</dd>
 *   <dt>isEnabled</dt><dd>True if the user is enabled in Service Manager, false otherwise.</dd>
 *   <dt>email</dt><dd>The email address of the user</dd>
 * </dl>
 */
declare class ReportsToStruct {
  public userId?: Int64;
  public firstName?: string;
  public lastName?: string;
  public isEnabled?: boolean;
  public email?: string;

    constructor(args?: { userId?: Int64; firstName?: string; lastName?: string; isEnabled?: boolean; email?: string; });
}

/**
 * Settings for a specific profile attribute.
 * 
 * <dl>
 *   <dt>visibility</dt><dd>Visibility of the profile attribute.</dd>
 *   <dt>editability</dt><dd>Editability of the profile attribute.</dd>
 * </dl>
 */
declare class UserProfileAttributeSettingStruct {
  public visibility?: AttributeVisibility;
  public editability?: AttributeEditability;

    constructor(args?: { visibility?: AttributeVisibility; editability?: AttributeEditability; });
}

/**
 * A profile attribute for a user.
 * 
 * <dl>
 *   <dt>profileValue</dt><dd>Value of the user profile attribute.</dd>
 *   <dt>profileAttributeSettings</dt><dd>Effective settings of the user profile attribute.</dd>
 * </dl>
 */
declare class UserProfileAttributeValueStruct {
  public profileValue?: string;
  public profileAttributeSettings?: UserProfileAttributeSettingStruct;

    constructor(args?: { profileValue?: string; profileAttributeSettings?: UserProfileAttributeSettingStruct; });
}

/**
 * Collection of user profile attributes that can be set by a user.
 * 
 * <dl>
 *   <dt>firstName</dt><dd>First name of the user.</dd>
 *   <dt>lastName</dt><dd>Last name of the user.</dd>
 *   <dt>customerUserId</dt><dd>Customer User ID of the user.</dd>
 *   <dt>jobTitle</dt><dd>Job title of the user.</dd>
 *   <dt>workPhone</dt><dd>Work phone of the user.</dd>
 *   <dt>mobilePhone</dt><dd>Mobile phone of the user.</dd>
 *   <dt>homePhone</dt><dd>Home phone of the user.</dd>
 *   <dt>reportToUserId</dt><dd>The SM user ID of the user in the "reports to" profile attribute.</dd>
 *   <dt>location</dt><dd>User's current location.</dd>
 *   <dt>reportsToEditability</dt><dd>User's reports-to editability setting.</dd>
 *   <dt>addressLine1</dt><dd>User's address line 1.</dd>
 *   <dt>addressLine2</dt><dd>User's address line 2.</dd>
 *   <dt>city</dt><dd>User's city.</dd>
 *   <dt>province</dt><dd>User's province.</dd>
 *   <dt>postalCode</dt><dd>User's postal code.</dd>
 *   <dt>country</dt><dd>User's country.</dd>
 *   <dt>email</dt><dd>User's email.</dd>
 * 
 * </dl>
 */
declare class UserProfileUserSetAttributesStruct {
  public firstName?: UserProfileAttributeValueStruct;
  public lastName?: UserProfileAttributeValueStruct;
  public customerUserId?: UserProfileAttributeValueStruct;
  public jobTitle?: UserProfileAttributeValueStruct;
  public workPhone?: UserProfileAttributeValueStruct;
  public mobilePhone?: UserProfileAttributeValueStruct;
  public homePhone?: UserProfileAttributeValueStruct;
  public reportsToUser?: ReportsToStruct;
  public location?: UserProfileAttributeValueStruct;
  public reportsToEditability?: AttributeEditability;
  public addressLine1?: UserProfileAttributeValueStruct;
  public addressLine2?: UserProfileAttributeValueStruct;
  public city?: UserProfileAttributeValueStruct;
  public province?: UserProfileAttributeValueStruct;
  public postalCode?: UserProfileAttributeValueStruct;
  public country?: UserProfileAttributeValueStruct;
  public email?: UserProfileAttributeValueStruct;

    constructor(args?: { firstName?: UserProfileAttributeValueStruct; lastName?: UserProfileAttributeValueStruct; customerUserId?: UserProfileAttributeValueStruct; jobTitle?: UserProfileAttributeValueStruct; workPhone?: UserProfileAttributeValueStruct; mobilePhone?: UserProfileAttributeValueStruct; homePhone?: UserProfileAttributeValueStruct; reportsToUser?: ReportsToStruct; location?: UserProfileAttributeValueStruct; reportsToEditability?: AttributeEditability; addressLine1?: UserProfileAttributeValueStruct; addressLine2?: UserProfileAttributeValueStruct; city?: UserProfileAttributeValueStruct; province?: UserProfileAttributeValueStruct; postalCode?: UserProfileAttributeValueStruct; country?: UserProfileAttributeValueStruct; email?: UserProfileAttributeValueStruct; });
}

/**
 * Profile for a company.
 * 
 * <dl>
 *   <dt>companyId</dt><dd>Service Manager ID of the company.</dd>
 *   <dt>companyName</dt><dd>Name of the company.</dd>
 *   <dt>addressLine1</dt><dd>Line 1 of the company address.</dd>
 *   <dt>addressLine2</dt><dd>Line 2 of the company address.</dd>
 *   <dt>city</dt><dd>City of the company.</dd>
 *   <dt>province</dt><dd>State of province of the company.</dd>
 *   <dt>postalCode</dt><dd>Postal code of the company.</dd>
 *   <dt>country</dt><dd>Country of the company.</dd>
 *   <dt>phoneNumber</dt><dd>Phone number of the company.</dd>
 *   <dt>website</dt><dd>Website of the company.</dd>
 *   <dt>email</dt><dd>Email of the company.</dd>
 *   <dt>companyLogo</dt><dd>Logo of the company, as a base64 image.</dd>
 *   <dt>description</dt><dd>Description of the company. Can contain HTML markup.</dd>
 *   <dt>productsAndServices</dt><dd>Products and services of the company. Can contain HTML markup.</dd>
 *   <dt>companyLegalName</dt><dd>Legal name of the company.</dd>
 *   <dt>lei</dt><dd>Legal entity identifier (LEI) of the company.</dd>
 *   <dt>legalEntityName</dt><dd>Legal entity name of the company.</dd>
 * </dl>
 */
declare class CompanyProfileStruct {
  public companyId?: number;
  public companyName?: string;
  public addressLine1?: string;
  public addressLine2?: string;
  public city?: string;
  public province?: string;
  public postalCode?: string;
  public country?: string;
  public phoneNumber?: string;
  public website?: string;
  public email?: string;
  public companyLogo?: string;
  public description?: string;
  public productsAndServices?: string;
  public companyLegalName?: string;
  public lei?: string;
  public legalEntityName?: string;

    constructor(args?: { companyId?: number; companyName?: string; addressLine1?: string; addressLine2?: string; city?: string; province?: string; postalCode?: string; country?: string; phoneNumber?: string; website?: string; email?: string; companyLogo?: string; description?: string; productsAndServices?: string; companyLegalName?: string; lei?: string; legalEntityName?: string; });
}

/**
 * Profile for a user.
 * 
 * <dl>
 *   <dt>userId</dt><dd>Service Manager ID of the user.</dd>
 *   <dt>userSetAttributes</dt><dd>Collection of user profile attributes that are (potentially) set by the user.</dd>
 *   <dt>grid</dt><dd>GRID of the user.</dd>
 *   <dt>emailAddresses</dt><dd>Collection of email addresses of the user.</dd>
 *   <dt>directReports</dt><dd>List of other users who directly report to the user. Limited to 3 direct reports returned.</dd>
 *   <dt>isDirectReportsTruncated</dt><dd>True if there are additional direct reports that were not included in the result. False otherwise.</dd>
 *   <dt>companyName</dt><dd>The user's company friendly name.</dd>
 *   <dt>companyLegalName</dt><dd>The user's company legal name.</dd>
 *   <dt>companyAddressLine1</dt><dd>The user's company address line 1.</dd>
 *   <dt>companyAddressLine2</dt><dd>The user's company address line 2.</dd>
 *   <dt>companyCity</dt><dd>The user's company city name.</dd>
 *   <dt>companyProvince</dt><dd>The user's company province name.</dd>
 *   <dt>companyPostalCode</dt><dd>The user's company postalCode.</dd>
 *   <dt>companyCountry</dt><dd>The user's company country name.</dd>
 *   <dt>companyPhoneNumber</dt><dd>The user's company phone number.</dd>
 *   <dt>companyEmail</dt><dd>The user's company email.</dd>
 *   <dt>companyDateModified</dt><dd>Either the DateModified of the Company or the CompanyProfile, whichever is more recent.</dd>
 *   <dt>companyId</dt><dd>Service Manager ID of the company.</dd>
 *   <dt>addressLine1</dt><dd>The user's address line 1.</dd>
 *   <dt>addressLine2</dt><dd>The user's address line 2.</dd>
 *   <dt>city</dt><dd>The user's city name.</dd>
 *   <dt>province</dt><dd>The user's province name.</dd>
 *   <dt>postalCode</dt><dd>The user's postalCode.</dd>
 *   <dt>country</dt><dd>The user's country name.</dd>
 * </dl>
 */
declare class UserProfileStruct {
  public userId?: Int64;
  public userSetAttributes?: UserProfileUserSetAttributesStruct;
  public grid?: string;
  public directReports?: ReportsToStruct[];
  public isDirectReportsTruncated?: boolean;
  public companyName?: string;
  public companyLegalName?: string;
  public companyAddressLine1?: string;
  public companyAddressLine2?: string;
  public companyCity?: string;
  public companyProvince?: string;
  public companyPostalCode?: string;
  public companyCountry?: string;
  public companyPhoneNumber?: string;
  public companyEmail?: string;
  public companyDateModified?: Int64;
  public companyId?: number;
  public addressLine1?: string;
  public addressLine2?: string;
  public city?: string;
  public province?: string;
  public postalCode?: string;
  public country?: string;
  public email?: string;

    constructor(args?: { userId?: Int64; userSetAttributes?: UserProfileUserSetAttributesStruct; grid?: string; directReports?: ReportsToStruct[]; isDirectReportsTruncated?: boolean; companyName?: string; companyLegalName?: string; companyAddressLine1?: string; companyAddressLine2?: string; companyCity?: string; companyProvince?: string; companyPostalCode?: string; companyCountry?: string; companyPhoneNumber?: string; companyEmail?: string; companyDateModified?: Int64; companyId?: number; addressLine1?: string; addressLine2?: string; city?: string; province?: string; postalCode?: string; country?: string; email?: string; });
}

/**
 * Directory settings for a company.
 * 
 * <dl>
 *   <dt>companyId</dt><dd>Service Manager ID of the company.</dd>
 *   <dt>publishUsers</dt><dd>Whether to publish eligible company users to the directory.</dd>
 *   <dt>firstNameSettings</dt><dd>Settings for the first name user profile attribute.</dd>
 *   <dt>lastNameSettings</dt><dd>Settings for the last name user profile attribute.</dd>
 *   <dt>customerUserIdSettings</dt><dd>Settings for the (customer) user ID user profile attribute.</dd>
 *   <dt>jobTitleSettings</dt><dd>Settings for the job title user profile attribute.</dd>
 *   <dt>workPhoneSettings</dt><dd>Settings for the work phone user profile attribute.</dd>
 *   <dt>mobilePhoneSettings</dt><dd>Settings for the mobile phone user profile attribute.</dd>
 *   <dt>homePhoneSettings</dt><dd>Settings for the home phone user profile attribute.</dd>
 *   <dt>reportsToSettings</dt><dd>Settings for the reports-to user profile attribute.</dd>
 *   <dt>emailVisibility</dt><dd>Visibility of user's email addresses.</dd>
 *   <dt>locationVisibility</dt><dd>Visibility of a user's location.</dd>
 *   <dt>addressSettings</dt><dd>Settings for the address user profile attribute.</dd>
 *   <dt>emailSettings</dt><dd>Settings for the email user profile attribute.</dd>
 * </dl>
 */
declare class DirectorySettingsStruct {
  public companyId?: number;
  public publishUsers?: boolean;
  public firstNameSettings?: UserProfileAttributeSettingStruct;
  public lastNameSettings?: UserProfileAttributeSettingStruct;
  public customerUserIdSettings?: UserProfileAttributeSettingStruct;
  public jobTitleSettings?: UserProfileAttributeSettingStruct;
  public workPhoneSettings?: UserProfileAttributeSettingStruct;
  public mobilePhoneSettings?: UserProfileAttributeSettingStruct;
  public homePhoneSettings?: UserProfileAttributeSettingStruct;
  public reportsToSettings?: UserProfileAttributeSettingStruct;
  public emailVisibility?: AttributeVisibility;
  public locationVisibility?: AttributeVisibility;
  public addressSettings?: UserProfileAttributeSettingStruct;
  public emailSettings?: UserProfileAttributeSettingStruct;

    constructor(args?: { companyId?: number; publishUsers?: boolean; firstNameSettings?: UserProfileAttributeSettingStruct; lastNameSettings?: UserProfileAttributeSettingStruct; customerUserIdSettings?: UserProfileAttributeSettingStruct; jobTitleSettings?: UserProfileAttributeSettingStruct; workPhoneSettings?: UserProfileAttributeSettingStruct; mobilePhoneSettings?: UserProfileAttributeSettingStruct; homePhoneSettings?: UserProfileAttributeSettingStruct; reportsToSettings?: UserProfileAttributeSettingStruct; emailVisibility?: AttributeVisibility; locationVisibility?: AttributeVisibility; addressSettings?: UserProfileAttributeSettingStruct; emailSettings?: UserProfileAttributeSettingStruct; });
}

/**
 * Auto-complete result.
 * 
 * <dl>
 *   <dt>userId</dt><dd>Service Manager ID of the user.</dd>
 *   <dt>firstName</dt><dd>User's first name.</dd>
 *   <dt>lastName</dt><dd>User's last name.</dd>
 *   <dt>email</dt><dd>An email address of the user. Used to distinguish users who may have the same first and last name.</dd>
 * </dl>
 */
declare class UserAutoCompleteResultStruct {
  public userId?: Int64;
  public firstName?: string;
  public lastName?: string;
  public email?: string;

    constructor(args?: { userId?: Int64; firstName?: string; lastName?: string; email?: string; });
}

/**
 * Criteria used for performing a basic directory search.
 * 
 * <dl>
 *  <dt>filter</dt><dd>Keywords to use. Each keyword must be at least one character.</dd>
 *  <dt>companyId</dt><dd>Optional company ID for which the search will be scoped. Ignored if not set or 0.</dd>
 *  <dt>echoToken</dt><dd>Echo token that will be included in the result structure. Ignored if not set.</dd>
 * </dl>
 */
declare class DirectoryBasicSearchParametersStruct {
  public keywords?: string[];
  public companyId?: number;
  public echoToken?: string;

    constructor(args?: { keywords?: string[]; companyId?: number; echoToken?: string; });
}

/**
 * Criteria used for performing an advanced directory search.
 * 
 * <dl>
 *  <dt>firstNameKeyword</dt><dd>Keyword for user's first name.</dd>
 *  <dt>lastNameKeyword</dt><dd>Keyword for user's last name.</dd>
 *  <dt>emailKeyword</dt><dd>Keyword for user's email addresses.</dd>
 *  <dt>gridKeyword</dt><dd>Keyword for the user's GRID.</dd>
 *  <dt>companyKeyword</dt><dd>Keyword for the company's name.</dd>
 *  <dt>cityKeyword</dt><dd>Keyword for company's city name.</dd>
 *  <dt>companyId</dt><dd>Optional company ID for which the search will be scoped. Ignored if not set or 0.</dd>
 *  <dt>echoToken</dt><dd>Echo token that will be included in the result structure. Ignored if not set.</dd>
 * </dl>
 */
declare class DirectoryAdvancedSearchParametersStruct {
  public firstNameFilter?: string;
  public lastNameFilter?: string;
  public emailFilter?: string;
  public gridFilter?: string;
  public companyFilter?: string;
  public cityFilter?: string;
  public companyId?: number;
  public echoToken?: string;

    constructor(args?: { firstNameFilter?: string; lastNameFilter?: string; emailFilter?: string; gridFilter?: string; companyFilter?: string; cityFilter?: string; companyId?: number; echoToken?: string; });
}

/**
 * Search match to be returned after a directory search.
 * 
 * <dl>
 *   <dt>userId</dt><dd>SM user ID of the user.</dd>
 *   <dt>companyName</dt><dd>Name of the user's company.</dd>
 *   <dt>firstName</dt><dd>First name of the user.</dd>
 *   <dt>lastName</dt><dd>Last name of the user.</dd>
 *   <dt>city</dt><dd>Name of the user's city.</dd>
 *   <dt>grid</dt><dd>GRID of the user.</dd>
 *   <dt>companyLegalName</dt><dd>Legal name of the user's company.</dd>
 *   <dt>email</dt><dd>The email address of the user</dd>
 * </dl>
 */
declare class DirectorySearchMatchStruct {
  public userId?: Int64;
  public companyName?: string;
  public firstName?: string;
  public lastName?: string;
  public city?: string;
  public grid?: string;
  public companyLegalName?: string;
  public email?: string;

    constructor(args?: { userId?: Int64; companyName?: string; firstName?: string; lastName?: string; city?: string; grid?: string; companyLegalName?: string; email?: string; });
}

/**
 * Search result to be returned for directory people search.
 * 
 * <dl>
 *   <dt>userId</dt><dd>SM user ID of the user.</dd>
 *   <dt>companyName</dt><dd>Name of the user's company.</dd>
 *   <dt>firstName</dt><dd>First name of the user.</dd>
 *   <dt>lastName</dt><dd>Last name of the user.</dd>
 *   <dt>city</dt><dd>Name of the user's city.</dd>
 *   <dt>grid</dt><dd>GRID of the user.</dd>
 *   <dt>companyLegalName</dt><dd>Legal name of the user's company.</dd>
 *   <dt>stateProvince</dt><dd>Name of the company's state/province.</dd>
 *   <dt>country</dt><dd>Name of the user's country.</dd>
 *   <dt>email</dt><dd>The email address of the user</dd>
 * </dl>
 */
declare class PeopleSearchResultStruct {
  public userId?: Int64;
  public companyName?: string;
  public firstName?: string;
  public lastName?: string;
  public city?: string;
  public grid?: string;
  public companyLegalName?: string;
  public stateProvince?: string;
  public country?: string;
  public email?: string;

    constructor(args?: { userId?: Int64; companyName?: string; firstName?: string; lastName?: string; city?: string; grid?: string; companyLegalName?: string; stateProvince?: string; country?: string; email?: string; });
}

/**
 * Search result to be returned for directory company search.
 * 
 * <dl>
 *   <dt>companyId</dt><dd>SM company ID of the company.</dd>
 *   <dt>companyName</dt><dd>Name of the company.</dd>
 *   <dt>companyLegalName</dt><dd>Legal name of the company.</dd>
 *   <dt>city</dt><dd>Name of the company's city.</dd>
 *   <dt>country</dt><dd>Name of the company's country.</dd>
 *   <dt>stateProvince</dt><dd>Name of the company's state/province.</dd>
 *   <dt>lei</dt><dd>Company's legal entity identifier (LEI).</dd>
 *   <dt>legalEntityName</dt><dd>Company's legal entity name.</dd>
 * </dl>
 */
declare class CompanySearchResultStruct {
  public companyId?: number;
  public companyName?: string;
  public companyLegalName?: string;
  public city?: string;
  public country?: string;
  public stateProvince?: string;
  public lei?: string;
  public legalEntityName?: string;

    constructor(args?: { companyId?: number; companyName?: string; companyLegalName?: string; city?: string; country?: string; stateProvince?: string; lei?: string; legalEntityName?: string; });
}

/**
 * People search aggregated results struct
 * 
 * <dl>
 *   <dt>totalNumberOfPeople</dt><dd>Total number of people that conforms to search criteria.</dd>
 *   <dt>people</dt><dd>people search results paged and sorted as per specified PagingStruct.</dd>
 *   <dt>echoToken</dt><dd>Echo token that was included in the search request (if one was supplied).</dd>
 *   <dt>offset</dt><dd>Value used as start index when search was performed.</dd>
 * </dl>
 */
declare class PeopleSearchResultsStruct {
  public totalNumberOfPeople?: number;
  public people?: PeopleSearchResultStruct[];
  public echoToken?: string;
  public offset?: number;

    constructor(args?: { totalNumberOfPeople?: number; people?: PeopleSearchResultStruct[]; echoToken?: string; offset?: number; });
}

/**
 * Company search aggregated results struct
 * 
 * <dl>
 *   <dt>totalNumberOfCompanies</dt><dd>Total number of companies that conforms to search criteria.</dd>
 *   <dt>companies</dt><dd>company search result paged and sorted as per specified PagingStruct.</dd>
 *   <dt>echoToken</dt><dd>Echo token that was included in the search request (if one was supplied).</dd>
 *   <dt>offset</dt><dd>Value used as start index when search was performed.</dd>
 * </dl>
 */
declare class CompanySearchResultsStruct {
  public totalNumberOfCompanies?: number;
  public companies?: CompanySearchResultStruct[];
  public echoToken?: string;
  public offset?: number;

    constructor(args?: { totalNumberOfCompanies?: number; companies?: CompanySearchResultStruct[]; echoToken?: string; offset?: number; });
}

/**
 * Criteria used for performing an standard directory people search.
 * 
 * <dl>
 *  <dt>firstNameFilter</dt><dd>Keyword for user's first name.</dd>
 *  <dt>lastNameFilter</dt><dd>Keyword for user's last name.</dd>
 *  <dt>emailFilter</dt><dd>Keyword for user's email addresses.</dd>
 *  <dt>gridFilter</dt><dd>Keyword for the user's GRID.</dd>
 *  <dt>companyFilter</dt><dd>Keyword for the user company name.</dd>
 *  <dt>cityFilter</dt><dd>Keyword for user's city name.</dd>
 *  <dt>countryFilter</dt><dd>Keyword for user's country name.</dd>
 *  <dt>provinceFilter</dt><dd>Keyword for the user's province.</dd>
 * </dl>
 */
declare class PeopleSearchFilterStruct {
  public firstNameFilter?: string;
  public lastNameFilter?: string;
  public emailFilter?: string;
  public gridFilter?: string;
  public companyFilter?: string;
  public cityFilter?: string;
  public countryFilter?: string;
  public provinceFilter?: string;

    constructor(args?: { firstNameFilter?: string; lastNameFilter?: string; emailFilter?: string; gridFilter?: string; companyFilter?: string; cityFilter?: string; countryFilter?: string; provinceFilter?: string; });
}

/**
 * Criteria used for performing a people directory search.
 * 
 * <dl>
 *  <dt>filter</dt><dd>Keywords to use. Each keyword must be at least one character.</dd>
 *  <dt>companyId</dt><dd>Optional company ID for which the search will be scoped. Ignored if not set or 0.</dd>
 *  <dt>echoToken</dt><dd>Echo token that will be included in the result structure. Ignored if not set.</dd>
 *  <dt>paging</dt><dd>The paging and sort information to use for the search.</dd>
 *  <dt>filters</dt><dd>Standard people search filters.</dd>
 *  <dt>userId</dt><dd>SM User Id of the user performing the search.</dd>
 *  <dt>scope</dt><dd>The scope of the search.</dd>
 *  <dt>excludeRosterEntries</dt><dd>Filter out roster entries of the user performing the search. False if not set.</dd>
 * </dl>
 */
declare class PeopleSearchParametersStruct {
  public keywords?: string[];
  public companyId?: number;
  public echoToken?: string;
  public paging?: PagingStruct;
  public filters?: PeopleSearchFilterStruct;
  public userId?: Int64;
  public scope?: SearchScope;
  public excludeRosterEntries?: boolean;

    constructor(args?: { keywords?: string[]; companyId?: number; echoToken?: string; paging?: PagingStruct; filters?: PeopleSearchFilterStruct; userId?: Int64; scope?: SearchScope; excludeRosterEntries?: boolean; });
}

/**
 * Criteria used for performing an standard directory company search.
 * 
 * <dl>
 *  <dt>companyNameFilter</dt><dd>Keyword for company's name.</dd>
 *  <dt>companyLegalNameFilter</dt><dd>Keyword for company's legal name.</dd>
 *  <dt>cityFilter</dt><dd>Keyword for company's city name.</dd>
 *  <dt>provinceFilter</dt><dd>Keyword for the company's province.</dd>
 *  <dt>countryFilter</dt><dd>Keyword for company's country name.</dd>
 *  <dt>leiFilter</dt><dd>Keyword for company's Legal Entity Identifier.</dd>
 * </dl>
 */
declare class CompanySearchFilterStruct {
  public companyNameFilter?: string;
  public companyLegalNameFilter?: string;
  public cityFilter?: string;
  public provinceFilter?: string;
  public countryFilter?: string;
  public leiFilter?: string;

    constructor(args?: { companyNameFilter?: string; companyLegalNameFilter?: string; cityFilter?: string; provinceFilter?: string; countryFilter?: string; leiFilter?: string; });
}

/**
 * Criteria used for performing a company directory search.
 * 
 * <dl>
 *  <dt>filter</dt><dd>Keywords to use. Each keyword must be at least one character.</dd>
 *  <dt>companyId</dt><dd>Optional company ID for which the search will be scoped. Ignored if not set or 0.</dd>
 *  <dt>echoToken</dt><dd>Echo token that will be included in the result structure. Ignored if not set.</dd>
 *  <dt>paging</dt><dd>The paging and sort information to use for the search.</dd>
 *  <dt>filters</dt><dd>Standard company search filters.</dd>
 *  <dt>actorId</dt><dd>Actor Id for the user performing the search.</dd>
 * </dl>
 */
declare class CompanySearchParametersStruct {
  public keywords?: string[];
  public companyId?: number;
  public echoToken?: string;
  public paging?: PagingStruct;
  public filters?: CompanySearchFilterStruct;
  public actorId?: Int64;

    constructor(args?: { keywords?: string[]; companyId?: number; echoToken?: string; paging?: PagingStruct; filters?: CompanySearchFilterStruct; actorId?: Int64; });
}

/**
 * Generic exception for error not defined in a more specific exception.
 * If a Service Manager validation exception - the entity, property, and validation message will be returned in detailed JSON format inside the description.
 */
declare class FailureException extends Thrift.TException {
  public description?: string;

    constructor(args?: { description?: string; });
}

/**
 * Exception thrown when Service Manager cannot update user profile settings
 * based on the company's user profile policy
 */
declare class UserProfileEditabilityException extends Thrift.TException {
}

/**
 * Exception thrown when a basic or advanced search contains an invalid criteria
 */
declare class InvalidSearchCriteriaException extends Thrift.TException {
}

/**
 * Exception returned when trying to perform any action using a user id that does not exist in the Service Manager database.
 */
declare class UserNotFoundException extends Thrift.TException {
  public userId?: Int64;

    constructor(args?: { userId?: Int64; });
}

/**
 * Exception thrown when trying to perform any action a user is not entitled to in the Service Manager database.
 */
declare class UserNotEntitledException extends Thrift.TException {
}

/**
 * Exception returned when an operation does not exist in Service Manager.
 */
declare class OperationNotFoundException extends Thrift.TException {
}

/**
 * *
 * The API version included on every request in the X-GR-API-VERSION header
 */
declare var X_GR_API_VERSION_VALUE: string;
