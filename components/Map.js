import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import SearchBar from '../components/SearchBar';
import Modal from '../components/Modal';
import Image from 'next/image';
import { returnRockPoints , returnRocks} from '../src/services/appwriteService';


const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rockPoints, setRockPoints] = useState([]);
  const [rockCoordsArray, setRockCoordArray] = useState([]);
  const [zoomedIn, setZoomTo] = useState(false);
  const [rocks, setRock] = useState([])

  useEffect(() => {
    // Initialize the map
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2hvbGlwb2xpIiwiYSI6ImNtM2Q3ZWgwMjAwYmkybHF0MHh5Ymdrc3MifQ.30-3zCn-lLiMt5lBJr0kUQ';
    const newMap = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [4.34878, 50.85045],
      zoom: 10,
    });

    newMap.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    setMap(newMap);

    // Clean up the map on unmount
    return () => {
      newMap.remove();
    };
  }, []);
  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2hvbGlwb2xpIiwiYSI6ImNtM2Q3ZWgwMjAwYmkybHF0MHh5Ymdrc3MifQ.30-3zCn-lLiMt5lBJr0kUQ';
    const newMap = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [4.34878, 50.85045],
      zoom: 10,
    });
  
    newMap.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    setMap(newMap);
  
    newMap.on('load', () => {
      console.log('Map is fully loaded');
    });
  
    // Clean up on unmount
    return () => {
      newMap.remove();
    };
  }, []);
  
  useEffect(() => {
    const fetchRockPoints = async () => {
      try {
        const rocks = await returnRocks();
        setRock(rocks);
        const points = await returnRockPoints(); // Replace '1' with the actual rock number if needed
        setRockPoints(points);
      } catch (error) {
        console.error('Failed to fetch rock points:', error);
      }
    };
  
    if (map) {
      fetchRockPoints();
    }
  }, [map]);
  
  function getRockString(n) {
    return `Rock${n}`;
  }

function isThePointLastOfThatIndex(pointIndex) {
  console.log(pointIndex)
  console.log(rockPoints)
  for (let i = pointIndex + 1 ; i < rockPoints.length; i++) {
    console.log(rockPoints[pointIndex].RockKey, rockPoints[i].RockKey)
    if (rockPoints[pointIndex].RockKey === rockPoints[i].RockKey) {
      console.log(pointIndex, 'false')
      return false
      
    }
  }
  console.log(pointIndex, 'true')
  return true
}

  useEffect(() => {
    console.log('here', rockPoints)
    console.log('rocks', rocks)
    if (map && rockPoints.length > 0) {
      map.on('load', () => {
        rocks.forEach(rock => {

          rockPoints.forEach((point, pointIndex) => {
            console.log('we are analysing for rock ', rock, 'the point ', point)
            console.log('yup', point.RockKey, rock.Rockindex, point.RockKey == rock.Rockindex)
            if (point.RockKey == rock.Rockindex) {
              if (!isThePointLastOfThatIndex(pointIndex)) {
                if (point.Longitude !== undefined && point.Latitude !== undefined) {
                  const el = document.createElement('div');
                  el.className = getRockString(point.RockKey);
                  el.style.width = '20px';
                  el.style.height = '20px';
                  el.style.backgroundColor = 'rgba(188, 207, 212, 1)'; // Replace this color as needed
                  el.style.borderRadius = '50%'; // Makes it a circle
                  el.style.border = '2px solid white';
                  el.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.5)';
                  new mapboxgl.Marker(el)
                    .setLngLat([point.Longitude, point.Latitude])
                    .setPopup(
                      new mapboxgl.Popup({ offset: 25 })
                        .setHTML(`
                          <div class="max-w-xs bg-white p-4 rounded-lg shadow-xl">
                              <h3 class="text-xl font-semibold text-gray-800 mb-2">Kayou n°${point.RockKey}</h3>
                              <p class="text-xs text-gray-600">${new Date(Date.parse(point.DateTime)).toLocaleString('fr-fr', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</p>
                              <p class="text-sm text-gray-600">${point.Message || 'No description available'}</p>
                              <img src="${point.PhotoURL}" alt="Rock Image" class="mt-3 rounded-lg w-full h-auto"/>
                          </div>
                      ` )
                    )
                    .addTo(map);
  
                  console.log('added', point.RockKey, point.Latitude, point.Longitude, el)
                }
              }
              else {
                if (point.Longitude !== undefined && point.Latitude !== undefined) {
                  const el = document.createElement('div');
                  el.style.backgroundImage = 'url(https://cloud.appwrite.io/v1/storage/buckets/6734e5b6000644c227a6/files/673767a0003d143d192e/view?project=6734c8dd00362854da62&project=6734c8dd00362854da62)'; // Replace with your image path
                  el.style.width = '32px'; // Customize width
                  el.style.height = '32px'; // Customize height
                  el.style.backgroundSize = 'cover'; // Make sure the image covers the element
                  new mapboxgl.Marker(el)
                    .setLngLat([point.Longitude, point.Latitude])
                    .setPopup(
                      new mapboxgl.Popup({ offset: 25 })
                        .setHTML(`
                          <div class="max-w-xs bg-white p-4 rounded-lg shadow-xl">
                              <h3 class="text-xl font-semibold text-gray-800 mb-2">Kayou n°${point.RockKey}</h3>
                              <p class="text-xs text-gray-600">${new Date(Date.parse(point.DateTime)).toLocaleString('fr-fr', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</p>
                              <p class="text-sm text-gray-600">${point.Message || 'No description available'}</p>
                              <img src="${point.PhotoURL}" alt="Rock Image" class="mt-3 rounded-lg w-full h-auto"/>
                          </div>
                      ` )
                    )
                    .addTo(map);
                }
              }
            }

          });

        })
      });

      /*
      let zoomedFlag = false;
      map.on('zoom', () => {
        const zoomLevel = map.getZoom();

        console.log(zoomLevel, zoomedFlag)
        if (zoomLevel >= 13 && !zoomedFlag) {
          console.log('under')
          zoomedFlag = true
          //markers.forEach(({ el }) => {
            //el.style.color = 'red'
          //});
        }
        else if (zoomLevel <= 13 && zoomedFlag){
          console.log('up')
          zoomedFlag=false
        }
      });
      */
    }
  }, [ rockPoints]);
  
  useEffect(() => {
    const rockCoords = []
    rockPoints.forEach(point => {
      rockCoords.push([point.Longitude, point.Latitude, point.RockKey])
    })
    setRockCoordArray(rockCoords)
  }, [rockPoints])

  useEffect(() => {
    if (map && rockCoordsArray.length > 0) {
      console.log('wuwu', rockCoordsArray);
  
      // Group coordinates by their index (3rd element)
      const groupedCoords = rockCoordsArray.reduce((groups, coord) => {
        const index = coord[2]; // Third element as index
        if (!groups[index]) groups[index] = [];
        groups[index].push([coord[0], coord[1]]); // Only include [longitude, latitude]
        return groups;
      }, {});
  
      map.on('load', () => {
        Object.keys(groupedCoords).forEach((index) => {
          const groupCoords = groupedCoords[index];
  
          const sourceId = `route-${index}`;
          const layerId = `line-${index}`;
  
          // Check if the source already exists
          if (map.getSource(sourceId)) {
            map.getSource(sourceId).setData({
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: groupCoords,
              },
            });
          } else {
            // Add the source if it doesn't exist
            map.addSource(sourceId, {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: groupCoords,
                },
              },
            });
  
            // Add the layer to display the line
            map.addLayer({
              id: layerId,
              type: 'line',
              source: sourceId,
              layout: {
                'line-join': 'round',
                'line-cap': 'round',
              },
              paint: {
                'line-color': '#888',
                'line-width': 4,
              },
            });
          }
        });
      });
    }
  }, [map, rockCoordsArray]);
  
  
  
  

  const handleButtonClick = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleSearch = (query) => {
    console.log(rockCoordsArray)
    let number = parseInt(query)
    console.log(`Searching for: ${query}`);
    for (let i = rockCoordsArray.length - 1; i > -1; i--) {
      if (rockCoordsArray[i][2] === number){
        console.log('found here: ', rockCoordsArray[i][0], rockCoordsArray[i][1])
        map.flyTo({
          center: [rockCoordsArray[i][0], rockCoordsArray[i][1]], // Replace with your coordinate
          zoom: 15, // Adjust the zoom level as needed
          essential: true, // Ensures the animation is essential for accessibility
        });
        break;
      }
    }
  };

  return (
    <div className="relative h-screen">
      <SearchBar onSearch={handleSearch} />
      <div id="map" className="w-full h-full"></div>
      <div className="absolute top-0 left-0 w-full h-[70px] bg-green-50 pointer-events-none border-b-2 border-slate-400 flex items-center">
        <Image src="/assets/images/logo.jpg" alt="Logo" className="h-12 ml-3" width={50} height={20} />
        <div id="PageName" className="ml-3 flex flex-col space-y-0 text-slate-900 font-bold">
          <div>Kayoux</div>
          <div>Voyageurs</div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[25vh] bg-gradient-to-b from-transparent to-green-50 pointer-events-none"></div>
      <button
        className="text-lg font-semibold absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-green-600 hover:bg-green-700 text-white px-7 py-3 rounded-full z-10 my-6"
        onClick={handleButtonClick}
      >
        I found a rock!
      </button>
      <Modal isVisible={isModalVisible} onClose={handleCloseModal} rocks={rocks} />
    </div>
  );
};

export default MapComponent;
