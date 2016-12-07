{-# LANGUAGE DeriveGeneric #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE DuplicateRecordFields #-}

import Data.Aeson as A
import Data.Aeson.Types as A
import Network.JSONApi as J hiding (id)
import GHC.Generics
import Data.Text (Text)
import qualified Data.Text as T
import qualified Data.Text.Read as T
import Data.ByteString.Lazy as B (ByteString)
import qualified Data.ByteString.Lazy as B
import Data.Maybe
import Data.HashMap.Strict (HashMap)
import qualified Data.HashMap.Strict as HM
import Text.Printf
import Prelude hiding (id)
import TextShow
import Data.Extend
import Data.Char as C

-- Input Data Types
data Schedule = Schedule {
      academic_level      :: Maybe Text
    , associated_class    :: Maybe Int
    , campus              :: Maybe Text
    , catalog_number      :: Maybe Text
    , class_number        :: Maybe Integer
    , classes             :: Maybe [Class]
    , enrollment_capacity :: Maybe Int
    , enrollment_total    :: Maybe Int
    , held_with           :: Maybe [Text]
    , last_updated        :: Maybe Text
    , note                :: Maybe Text
    , related_component_1 :: Maybe Text
    , related_component_2 :: Maybe Text
    , reserves            :: Maybe [Text]
    , section             :: Maybe Text
    , subject             :: Maybe Text
    , term                :: Maybe Int
    , title               :: Maybe Text
    , topic               :: Maybe Text
    , units               :: Maybe Float
    , waiting_capacity    :: Maybe Int
    , waiting_total       :: Maybe Int
} deriving (Generic, Show)

instance FromJSON Schedule
instance ToJSON Schedule

data Class = Class {
      date        :: Maybe Date
    , instructors :: Maybe [Text]
    , location    :: Maybe Location
} deriving (Generic, Show)

instance FromJSON Class
instance ToJSON Class

data Location = Location {
      building :: Maybe Text
    , room     :: Maybe Text
} deriving (Generic, Show)

instance FromJSON Location
instance ToJSON Location

data Date = Date {
      end_date     :: Maybe Text
    , end_time     :: Maybe Text
    , is_cancelled :: Maybe Bool
    , is_closed    :: Maybe Bool
    , is_tba       :: Maybe Bool
    , start_date   :: Maybe Text
    , start_time   :: Maybe Text
    , weekdays     :: Maybe Text
} deriving (Generic, Show)

instance FromJSON Date
instance ToJSON Date


-- Output Data Types
data Time = Time {
      hour   :: Int
    , minute :: Int
} deriving (Generic, Show)

instance FromJSON Time
instance ToJSON Time

data Section = Section {
      id         :: Integer
    , weekdays   :: [Bool]
    , instructor :: Text
    , start      :: Time
    , end        :: Time
    , enrolled   :: Int
    , capacity   :: Int
    , section    :: Text
} deriving (Generic, Show)

instance FromJSON Section
instance ToJSON Section

snakeToCamel :: String -> String
snakeToCamel = snakeToCamel' False
    where 
        snakeToCamel' _ []        = []
        snakeToCamel' _ ('_':xs)  = snakeToCamel' True xs
        snakeToCamel' saw_ (x:xs) = (if saw_ then C.toUpper x else x) 
                                        : snakeToCamel' False xs


parseInput :: ByteString -> [Schedule]
parseInput str = 
  case fromJSON $ findData $ fromJust $ decode str of
      Success a -> a
      A.Error e -> error $ printf "could not parse: %v...\nError: %v\n" (take 100 $ show str) e
    where 
      findData :: HashMap Text Value -> Value
      findData m = m HM.! "data"


parseWeekday :: Text -> [Bool]
parseWeekday txt = [hasM, hasT, hasW, hasTh, hasF]
    where 
        
        hasM = T.replace "M" "" txt /= txt
        hasT = let s = T.replace "Th" "" txt in T.replace "T" "" s /= s
        hasW = T.replace "W" "" txt /= txt
        hasTh = T.replace "Th" "" txt /= txt
        hasF = T.replace "F" "" txt /= txt

parseTime :: Text -> Time
parseTime txt = Time hi mi 
    where 
        [h,m] = T.splitOn ":" txt
        Right (hi,_) = T.decimal h
        Right (mi,_) = T.decimal m
    
rmMidName :: [Text] -> [Text]
rmMidName ls = head ls : (init $ tail ls)
    
schedule2section :: Schedule -> Section
schedule2section s = Section {
          id          = fromJust $ class_number s
        , section     = fromJust $ section (s :: Schedule)
        , weekdays    = parseWeekday $ fromJust $ weekdays' =<< (date =<< head <$> classes s :: Maybe Date)
        , instructor  = 
            case (instructors =<< head <$> classes s) of 
                Just [] -> ""
                Just ls -> T.unwords $ reverse $ T.split (`elem` [',']) $ head ls
                Nothing -> ""
        , start   = parseTime $ fromJust $ start_time =<< date =<< head <$> classes s
        , end     = parseTime $ fromJust $ end_time =<< date =<< head <$> classes s
        , enrolled    = fromJust $ enrollment_total s
        , capacity    = fromJust $ enrollment_capacity s
    }
    where
        weekdays' :: Date -> Maybe Text
        weekdays' = weekdays
    
instance ResourcefulEntity Section where
    resourceIdentifier a = showt $ id a
    resourceType = const "class"
    resourceLinks = const Nothing
    resourceMetaData = const Nothing
    resourceRelationships = const Nothing


outputDocument :: [Section] -> Document Section
outputDocument cs = mkDocument cs Nothing Nothing 

main :: IO ()
main = do
    txt <- B.getContents
    let schedules = parseInput txt
    let sections = map schedule2section schedules
    B.putStr $ encode $ outputDocument sections
    