module hero::hero {
    use aptos_framework::account::{Self, SignerCapability};

    use std::error;
    use std::option::{Self, Option};
    use std::signer;
    use std::string::{Self, String};

    use aptos_framework::object::{Self, ConstructorRef, Object};

    use aptos_token_objects::collection;
    use aptos_token_objects::token;
    use aptos_std::string_utils;

    use aptos_token_objects::property_map;

    const ENOT_A_HERO: u64 = 1;
    const ENOT_A_WEAPON: u64 = 2;
    const ENOT_A_GEM: u64 = 3;
    const ENOT_CREATOR: u64 = 4;
    const ENOT_OWNER: u64 = 5;
    const EINVALID_WEAPON_UNEQUIP: u64 = 6;
    const EINVALID_GEM_UNEQUIP: u64 = 7;
    const EINVALID_TYPE: u64 = 8;

    ///  To generate resource account
    const STATE_SEED: vector<u8> = b"hero_signer";

    /// Global state
    struct State has key {
        // the signer cap of the module's resource account
        signer_cap: SignerCapability
    }


    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct Hero has key {
        armor: Option<Object<Armor>>,
        gender: String,
        race: String,
        shield: Option<Object<Shield>>,
        weapon: Option<Object<Weapon>>,
        mutator_ref: token::MutatorRef, 
        property_mutator_ref: property_map::MutatorRef, 
    }

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct Armor has key {
        defense: u64,
        gem: Option<Object<Gem>>,
        weight: u64,
    }

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct Gem has key {
        attack_modifier: u64,
        defense_modifier: u64,
        magic_attribute: String,
    }

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct Shield has key {
        defense: u64,
        gem: Option<Object<Gem>>,
        weight: u64,
    }

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct Weapon has key {
        attack: u64,
        gem: Option<Object<Gem>>,
        weapon_type: String,
        weight: u64,
    }

    fun init_module(account: &signer) {
        let (resource_account, signer_cap) = account::create_resource_account(account, STATE_SEED);
        let collection = string::utf8(b"Hero Quest!");
        collection::create_unlimited_collection(
            &resource_account,
            string::utf8(b"collection description"),
            collection,
            option::none(),
            string::utf8(b"collection uri"),
        );

        move_to(account, State {
            signer_cap
        });

        // move_to(&resource_account, State {
        //     signer_cap
        // });
    }

    fun create(
        creator: &signer,
        description: String,
        name: String,
        uri: String,
    ): ConstructorRef acquires State {

        let state = borrow_global_mut<State>(@hero);
        let resource_account = account::create_signer_with_capability(&state.signer_cap); 
        token::create_named_token(
            &resource_account,
            string::utf8(b"Hero Quest!"), 
            description,
            name,
            option::none(),
            uri,
        )
    }

    // Creation methods

    public fun create_hero(
        creator: &signer,
        description: String,
        gender: String,
        name: String,
        race: String,
        uri: String,
    ): Object<Hero> acquires State {
        // generate resource acct
        // let resource_address = get_resource_address();
        // ! use this if the owner of cap is resource address.
        let state = borrow_global_mut<State>(@hero);
        let resource_account = account::create_signer_with_capability(&state.signer_cap);

        let constructor_ref = create(&resource_account, description, name, uri);
        let token_signer = object::generate_signer(&constructor_ref);

        // <-- create properties
        let property_mutator_ref = property_map::generate_mutator_ref(&constructor_ref); 
        let properties = property_map::prepare_input(vector[], vector[], vector[]);

        property_map::init(&constructor_ref, properties);
        property_map::add_typed<String>(
            &property_mutator_ref,
            string::utf8(b"name"),
            name,
        );
        property_map::add_typed<String>(
            &property_mutator_ref,
            string::utf8(b"description"),
            description,
        );
        property_map::add_typed<String>(
            &property_mutator_ref,
            string::utf8(b"gender"),
            gender,
        );
        // create properties -->

        let hero = Hero {
            armor: option::none(),
            gender,
            race,
            shield: option::none(),
            weapon: option::none(),
            mutator_ref: token::generate_mutator_ref(&constructor_ref),
            property_mutator_ref,
        };
        move_to(&token_signer, hero);

        // move to creator

        let transfer_ref = object::generate_transfer_ref(&constructor_ref);
        let creator_address = signer::address_of(creator);
        object::transfer_with_ref(object::generate_linear_transfer_ref(&transfer_ref), creator_address);

        object::address_to_object(signer::address_of(&token_signer))


    }

    public fun create_weapon(
        creator: &signer,
        attack: u64,
        description: String,
        name: String,
        uri: String,
        weapon_type: String,
        weight: u64,
    ): Object<Weapon> acquires State {

        let state = borrow_global_mut<State>(@hero);
        let resource_account = account::create_signer_with_capability(&state.signer_cap);

        let constructor_ref = create(&resource_account, description, name, uri);
        
        let token_signer = object::generate_signer(&constructor_ref);

        let weapon = Weapon {
            attack,
            gem: option::none(),
            weapon_type,
            weight,
        };
        move_to(&token_signer, weapon);

        // Move token to creator
        let transfer_ref = object::generate_transfer_ref(&constructor_ref);
        let creator_address = signer::address_of(creator);
        object::transfer_with_ref(object::generate_linear_transfer_ref(&transfer_ref), creator_address);

        object::address_to_object(signer::address_of(&token_signer))
    }

    public fun create_gem(
        creator: &signer,
        attack_modifier: u64,
        defense_modifier: u64,
        description: String,
        magic_attribute: String,
        name: String,
        uri: String,
    ): Object<Gem> acquires State {
        let state = borrow_global_mut<State>(@hero);
        let resource_account = account::create_signer_with_capability(&state.signer_cap);

        let constructor_ref = create(&resource_account, description, name, uri);

        let token_signer = object::generate_signer(&constructor_ref);

        let gem = Gem {
            attack_modifier,
            defense_modifier,
            magic_attribute,
        };
        move_to(&token_signer, gem);

        // Move token to creator
        let transfer_ref = object::generate_transfer_ref(&constructor_ref);
        let creator_address = signer::address_of(creator);
        object::transfer_with_ref(object::generate_linear_transfer_ref(&transfer_ref), creator_address);

        object::address_to_object(signer::address_of(&token_signer))
    }

    // Transfer wrappers

    public entry fun hero_equip_weapon(owner: &signer, hero: Object<Hero>, weapon: Object<Weapon>) acquires Hero {
        let hero_obj = borrow_global_mut<Hero>(object::object_address(&hero));
        option::fill(&mut hero_obj.weapon, weapon);
        object::transfer_to_object(owner, weapon, hero);
    }

    public entry fun hero_unequip_weapon(owner: &signer, hero: Object<Hero>, weapon: Object<Weapon>) acquires Hero {
        let hero_obj = borrow_global_mut<Hero>(object::object_address(&hero));
        let stored_weapon = option::extract(&mut hero_obj.weapon);
        assert!(stored_weapon == weapon, error::not_found(EINVALID_WEAPON_UNEQUIP));
        object::transfer(owner, weapon, signer::address_of(owner));
    }

    public entry fun weapon_equip_gem(owner: &signer, weapon: Object<Weapon>, gem: Object<Gem>) acquires Weapon {
        let weapon_obj = borrow_global_mut<Weapon>(object::object_address(&weapon));
        option::fill(&mut weapon_obj.gem, gem);
        object::transfer_to_object(owner, gem, weapon);
    }

    public entry fun weapon_unequip_gem(owner: &signer, weapon: Object<Weapon>, gem: Object<Gem>) acquires Weapon {
        let weapon_obj = borrow_global_mut<Weapon>(object::object_address(&weapon));
        let stored_gem = option::extract(&mut weapon_obj.gem);
        assert!(stored_gem == gem, error::not_found(EINVALID_GEM_UNEQUIP));
        object::transfer(owner, gem, signer::address_of(owner));
    }

    // Entry functions

    // entry  fun create_collection(account: &signer) {
    //     let collection = string::utf8(b"Hero Quest!");
    //     collection::create_unlimited_collection(
    //         account,
    //         string::utf8(b"collection description"),
    //         collection,
    //         option::none(),
    //         string::utf8(b"collection uri"),
    //     );
    // }

    entry fun mint_hero(
        account: &signer,
        description: String,
        gender: String,
        name: String,
        race: String,
        uri: String,
    ) acquires State {
        create_hero(account, description, gender, name, race, uri);
    }

    entry fun mint_weapon(
        account: &signer,
        description: String,
        name: String,
        uri: String,
        attack: u64, 
        weapon_type: String,
        weight: u64,
    ) acquires State {
        // creator: &signer,
        // attack: u64,
        // description: String,
        // name: String,
        // uri: String,
        // weapon_type: String,
        // weight: u64,
        create_weapon(account, attack, description, name, uri, weapon_type, weight);
    }

    entry fun mint_gem(
        account: &signer,
        description: String,
        magic_attribute: String,
        name: String,
        uri: String, 
        attack_modifier: u64,
        defense_modifier: u64
    ) acquires State {
        // creator: &signer,
        // attack_modifier: u64,
        // defense_modifier: u64,
        // description: String,
        // magic_attribute: String,
        // name: String,
        // uri: String,
        create_gem(account, attack_modifier, defense_modifier, description, magic_attribute, name, uri);
    }

    // TODO: impl this.
    public entry fun update_hero_description(
        account: &signer,
        collection: String,
        name: String, 
        description: String
    ) acquires Hero, State {
        // ger resource account
        let state = borrow_global_mut<State>(@hero);
        let resource_account = account::create_signer_with_capability(&state.signer_cap);

        // get hero by creator
        let (hero_obj, hero) = get_hero(
            &signer::address_of(&resource_account),
            &collection,
            &name
        );
        // let constructor_ref = create(&resource_account, description, name, uri);
        // let property_mutator_ref = property_map::generate_mutator_ref(&constructor_ref); 
        
        // let creator_addr = token::creator(hero_obj);

        let account_address = signer::address_of(account);
        
        // rule: only owner could modify this one.
        // assert!(object::is_owner(hero_obj, account_address), ENOT_OWNER);
        // rule 0x02: only cap owner could modify this one.
        assert!(account_address == @hero, ENOT_CREATOR);
        // Gets `property_mutator_ref` of hero.
        let property_mutator_ref = &hero.property_mutator_ref;
        // Updates the description property.
        property_map::update_typed(property_mutator_ref, &string::utf8(b"description"), description);
    }

    // View functions
    
    #[view]
    public fun is_whitelisted(account: &signer): bool {
       true
    }

        #[view]
    public fun test_func(): bool {
       true
    }

    #[view]
    public fun get_resouce_account(account: &signer): address {
        let (resource_account, resource_signer_cap) = account::create_resource_account(account, STATE_SEED);
        let resource_address = signer::address_of(&resource_account);
        resource_address
    }
    #[view]
    public fun get_resouce_account_correctly(): address acquires State{

        // let resource_address = get_resource_address();
        let state = borrow_global_mut<State>(@hero);
        let resource_account = account::create_signer_with_capability(&state.signer_cap);
        let resource_address = signer::address_of(&resource_account);
        resource_address
    }
    #[view]
    public fun get_collection_address(creator: address, collection: String): address {
        collection::create_collection_address(&creator, &collection)
    }
    #[view]
    public fun get_resource_address(): address {
        account::create_resource_address(&@hero, STATE_SEED)
    }

    #[view]
    public fun get_resource_address_by_addr(creator: address): address {
        account::create_resource_address(&creator, STATE_SEED)
    }

    public fun view_hero(creator: address, collection: String, name: String): Hero acquires Hero {
        let token_address = token::create_token_address(
            &creator,
            &collection,
            &name,
        );
        move_from<Hero>(token_address)
    }

    #[view]
    public fun view_hero_by_object(hero_obj: Object<Hero>): Hero acquires Hero {
        let token_address = object::object_address(&hero_obj);
        move_from<Hero>(token_address)
    }

    #[view]
    public fun view_object<T: key>(obj: Object<T>): String acquires Armor, Gem, Hero, Shield, Weapon {
        let token_address = object::object_address(&obj);
        if (exists<Armor>(token_address)) {
            string_utils::to_string(borrow_global<Armor>(token_address))
        } else if (exists<Gem>(token_address)) {
            string_utils::to_string(borrow_global<Gem>(token_address))
        } else if (exists<Hero>(token_address)) {
            string_utils::to_string(borrow_global<Hero>(token_address))
        } else if (exists<Shield>(token_address)) {
            string_utils::to_string(borrow_global<Shield>(token_address))
        } else if (exists<Weapon>(token_address)) {
            string_utils::to_string(borrow_global<Weapon>(token_address))
        } else {
            abort EINVALID_TYPE
        }
    }

    inline fun get_hero(creator: &address, collection: &String, name: &String): (Object<Hero>, &Hero) {
        let token_address = token::create_token_address(
            creator,
            collection,
            name,
        );
        (object::address_to_object<Hero>(token_address), borrow_global<Hero>(token_address))
    }

    #[test(account = @0x3)]
    fun test_hero_with_gem_weapon(account: &signer) acquires Hero, OnChainConfig, Weapon {
        init_module(account);

        let hero = create_hero(
            account,
            string::utf8(b"The best hero ever!"),
            string::utf8(b"Male"),
            string::utf8(b"Wukong"),
            string::utf8(b"Monkey God"),
            string::utf8(b""),
        );

        let weapon = create_weapon(
            account,
            32,
            string::utf8(b"A magical staff!"),
            string::utf8(b"Ruyi Jingu Bang"),
            string::utf8(b""),
            string::utf8(b"staff"),
            15,
        );

        let gem = create_gem(
            account,
            32,
            32,
            string::utf8(b"Beautiful specimen!"),
            string::utf8(b"earth"),
            string::utf8(b"jade"),
            string::utf8(b""),
        );

        let account_address = signer::address_of(account);
        assert!(object::is_owner(hero, account_address), 0);
        assert!(object::is_owner(weapon, account_address), 1);
        assert!(object::is_owner(gem, account_address), 2);

        hero_equip_weapon(account, hero, weapon);
        assert!(object::is_owner(hero, account_address), 3);
        assert!(object::is_owner(weapon, object::object_address(&hero)), 4);
        assert!(object::is_owner(gem, account_address), 5);

        weapon_equip_gem(account, weapon, gem);
        assert!(object::is_owner(hero, account_address), 6);
        assert!(object::is_owner(weapon, object::object_address(&hero)), 7);
        assert!(object::is_owner(gem, object::object_address(&weapon)), 8);

        hero_unequip_weapon(account, hero, weapon);
        assert!(object::is_owner(hero, account_address), 9);
        assert!(object::is_owner(weapon, account_address), 10);
        assert!(object::is_owner(gem, object::object_address(&weapon)), 11);

        weapon_unequip_gem(account, weapon, gem);
        assert!(object::is_owner(hero, account_address), 12);
        assert!(object::is_owner(weapon, account_address), 13);
        assert!(object::is_owner(gem, account_address), 14);
    }
}