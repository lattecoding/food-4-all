//This will be Netra’s page to add in favorites jpeg
// Need to write the code the will allow  user to click on Favorites icon (this is how it’s labeled in Board.tsx to reference) <BottomNavigationAction label=“Favorites” icon={<FavoriteIcon />} />, the user should be redirected to favorites page in which our ‘dummy’ favorites will display.

const Favorites = () => {
    const dummyFavorites = [
        { id: 1, name: 'Favorite Item 1' },
        { id: 2, name: 'Favorite Item 2' },
        { id: 3, name: 'Favorite Item 3' },
    ];

    return (
        <div>
            <h1>Favorites</h1>
            <ul>
                {dummyFavorites.map(item => (
                    <li key={item.id}>{item.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default Favorites;