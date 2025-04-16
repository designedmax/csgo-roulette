interface WinningSkinProps {
  skin: {
    name: string;
    price: number;
    image: string;
  };
}

export default function WinningSkin({ skin }: WinningSkinProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 text-center">You Won!</h2>
      <div className="flex flex-col items-center">
        <img 
          src={skin.image} 
          alt={skin.name}
          className="w-32 h-32 object-contain mb-4"
        />
        <h3 className="text-lg font-semibold mb-2">{skin.name}</h3>
        <p className="text-gray-400">Price: {skin.price} ₽</p>
      </div>
    </div>
  );
} 